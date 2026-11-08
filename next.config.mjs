export default {
  poweredByHeader: false,
  outputFileTracingIncludes: {'/api/helper':['./lib/*.mjs','./lib/*.json','./tests/*.mjs','./scripts/evaluate.mjs']},
  async headers() { return [{ source: '/(.*)', headers: [
    {key:'X-Content-Type-Options',value:'nosniff'},
    {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
    {key:'X-Frame-Options',value:'DENY'}
  ]}]; }
};
