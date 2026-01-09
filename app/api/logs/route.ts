import { NextRequest } from 'next/server';

// 검색어를 APL 쿼리에서 안전하게 사용할 수 있도록 이스케이프
const escapeSearchString = (str: string): string => {
  if (!str) return str;
  // APL 쿼리에서 특수문자 이스케이프 처리
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
};

// 로그를 조회하는 GET 메서드
export const GET = async (request: NextRequest) => {
  try {
    // URL 파라미터에서 필터 값 가져오기
    const { searchParams } = new URL(request.url);
    const level = searchParams.getAll('level');
    const category = searchParams.getAll('category');
    const search = searchParams.get('search') || '';
    const method = searchParams.getAll('method');
    const statusCode = searchParams.getAll('statusCode');
    const host = searchParams.get('host') || '';
    const path = searchParams.get('path') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const datasetFromParam = searchParams.get('dataset') || '';

    // 헤더에서 토큰 가져오기 (클라이언트에서 Authorization 헤더로 전달)
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    // 쿼리 파라미터로 받은 데이터셋 이름 사용, 없을 경우 환경변수 사용
    const dataset = datasetFromParam;

    if (!dataset || !token) {
      return new Response(
        JSON.stringify({ error: 'Axiom credentials not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 날짜 파라미터를 ISO 형식으로 변환 (사용자 로컬 시간 기준 처리)
    const convertToDateRange = (dateStr: string, isEndDate: boolean = false) => {
      if (!dateStr) return undefined;

      try {
        // 날짜 문자열을 파싱 (YYYY-MM-DD 형식 가정)
        const [year, month, day] = dateStr.split('-').map(Number);

        // 유효한 날짜인지 확인
        const date = new Date(year, month - 1, day);
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
          throw new Error('Invalid date');
        }

        // 시작 날짜는 00:00:00, 종료 날짜는 23:59:59로 설정
        if (!isEndDate) {
          date.setHours(0, 0, 0, 0);
        } else {
          date.setHours(23, 59, 59, 999);
        }

        return date.toISOString();
      } catch (e) {
        return undefined;
      }
    };

    const startDate = convertToDateRange(dateFrom);
    const endDate = convertToDateRange(dateTo, true);

    // Axiom API 호출을 위한 APL 쿼리 구성
    let aplQuery = `['${dataset}']`;

    // 필터 조건 추가
    const filters: string[] = [];

    // 레벨 필터 - 배열을 OR 조건으로 변환 (여러 가능한 필드 이름 시도)
    if (level && level.length > 0) {
      filters.push(`(level in (${level.map(l => `'${l}'`).join(', ')}))`);
    }

    // 카테고리 필터 - 배열을 OR 조건으로 변환 (여러 가능한 필드 이름 시도)
    if (category && category.length > 0) {
      filters.push(`(['fields.category'] in (${category.map(c => `'${c}'`).join(', ')}))`);
    }

    // 메시지 검색 필터 - 다양한 가능성이 있는 필드명들을 OR 조건으로 처리
    const escapedSearch = escapeSearchString(search);
    if (escapedSearch) {
      filters.push(`(['message'] contains '${escapedSearch}')`);
    }

    // HTTP 메서드 필터 - 배열을 OR 조건으로 변환 (여러 가능한 필드 이름 시도)
    if (method && method.length > 0) {
      const methodConditions = method.map(m => `(['fields.method'] == '${m}' or ['fields.request.method'] == '${m}')`);
      filters.push(`(${methodConditions.join(' or ')})`);
    }

    // 상태 코드 필터 - 배열을 OR 조건으로 변환 (여러 가능한 필드 이름 시도)
    if (statusCode && statusCode.length > 0) {
      const statusConditions = statusCode.map(status => {
        if (status.endsWith('xx')) {
          // 2xx, 3xx, 4xx, 5xx 형식의 범위 필터
          const rangePrefix = status.charAt(0);
          const rangeStart = parseInt(rangePrefix) * 100;
          const rangeEnd = (parseInt(rangePrefix) + 1) * 100 - 1;
          return `(!isnull(['fields.statusCode']) and ['fields.statusCode'] >= ${rangeStart} and ['fields.statusCode'] <= ${rangeEnd})`;
        } else {
          // 특정 상태 코드 필터
          return `(['fields.statusCode'] == ${status})`;
        }
      });
      filters.push(`(${statusConditions.join(' or ')})`);
    }

    // 호스트 필터 추가
    if (host) {
      const escapedHost = escapeSearchString(host);
      filters.push(`(['fields.host'] == '${escapedHost}' or ['fields.request.origin'] == '${escapedHost}' or ['fields.request.headers.host'] == '${escapedHost}')`);
    }

    // 경로 필터 추가
    if (path) {
      const escapedPath = escapeSearchString(path);
      filters.push(`(['fields.path'] == '${escapedPath}' or ['fields.request.path'] == '${escapedPath}' or ['fields.request.url'] == '${escapedPath}')`);
    }

    // 날짜 범위 필터 추가
    if (startDate) filters.push(`_time >= datetime('${startDate}')`);
    if (endDate) filters.push(`_time <= datetime('${endDate}')`);

    if (filters.length > 0) {
      aplQuery += ` | where ${filters.join(' and ')}`;
    }

    // 최신 로그부터 정렬
    aplQuery += ' | sort by _time desc';

    // 페이지네이션 제거 - 전체 로그 반환
    aplQuery += ' | limit 10000';

    // Axiom API 호출
    const response = await fetch('https://api.axiom.co/v1/datasets/_apl?format=tabular', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apl: aplQuery,
      }),
    });

    // 응답이 성공적이지 않은 경우 에러 처리
    if (!response.ok) {
      const errorText = await response.text();

      return new Response(
        JSON.stringify({ error: 'Failed to fetch logs', details: errorText }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const logs = await response.json();

    // Axiom의 새로운 응답 형식 처리
    const table = logs.tables[0];
    const columns = table.columns;

    // columns를 객체 배열로 변환
    const rows: Record<string, any>[] = [];
    if (columns && columns.length > 0 && columns[0].length > 0) {
      const rowCount = columns[0].length;
      for (let i = 0; i < rowCount; i++) {
        const row: Record<string, any> = {};
        table.fields.forEach((field: any, index: number) => {
          row[field.name] = columns[index][i];
        });
        rows.push(row);
      }
    }

    // 전체 로그 응답 형식으로 변환 (페이지네이션 제거)
    const responsePayload = {
      rows: rows,
      metadata: {
        totalRows: logs.status.rowsMatched,
      },
      aplQuery // 생성된 APL 쿼리를 응답에 포함
    };

    return new Response(JSON.stringify(responsePayload), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

export const dynamic = 'force-dynamic';