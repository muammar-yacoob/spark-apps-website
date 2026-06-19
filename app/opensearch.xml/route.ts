import { SITE_NAME, SITE_URL } from '@/lib/config/site';

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>${SITE_NAME}</ShortName>
  <Description>Search ${SITE_NAME}</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Url type="text/html" template="${SITE_URL}/?q={searchTerms}"/>
  <Image width="16" height="16" type="image/x-icon">${SITE_URL}/favicon.ico</Image>
</OpenSearchDescription>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/opensearchdescription+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
