const fetch = require('node-fetch');

module.exports = async function (context, req) {
    const filter = req.query['$filter'] || '';
    const top = req.query['$top'] || '1000';
    const skipToken = req.query['$skipToken'] || '';

    let url = `https://prices.azure.com/api/retail/prices?$filter=${encodeURIComponent(filter)}&$top=${top}`;
    if (skipToken) url += `&$skipToken=${encodeURIComponent(skipToken)}`;

    try {
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            context.res = {
                status: response.status,
                body: { error: `Azure API error: ${response.status}` }
            };
            return;
        }

        const data = await response.json();

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600'
            },
            body: data
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: { error: err.message }
        };
    }
};
