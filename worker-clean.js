export default {
  async fetch(request, env) {
    const ao = env.ALLOWED_ORIGIN || 'https://mr-ilyosbek98.github.io';
    const ch = {
      'Access-Control-Allow-Origin': ao,
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: ch });
    }
    const url = new URL(request.url);
    const p = url.pathname;
    const TG = 'https://api.telegram.org/bot' + env.BOT_TOKEN;

    if (p === '/send-message' && request.method === 'POST') {
      const b = await request.json();
      const tb = { chat_id: b.chat_id, text: b.text, parse_mode: b.parse_mode || 'HTML' };
      if (b.reply_markup) tb.reply_markup = b.reply_markup;
      const r = await fetch(TG + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tb)
      });
      return new Response(await r.text(), { headers: { ...ch, 'Content-Type': 'application/json' } });
    }

    if (p === '/get-updates') {
      const offset = url.searchParams.get('offset') || '0';
      const r = await fetch(TG + '/getUpdates?offset=' + offset + '&timeout=5&allowed_updates=["callback_query","message"]');
      return new Response(await r.text(), { headers: { ...ch, 'Content-Type': 'application/json' } });
    }

    if (p === '/answer-callback' && request.method === 'POST') {
      const b = await request.json();
      const r = await fetch(TG + '/answerCallbackQuery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(b)
      });
      return new Response(await r.text(), { headers: { ...ch, 'Content-Type': 'application/json' } });
    }

    if (p === '/edit-message' && request.method === 'POST') {
      const b = await request.json();
      const r = await fetch(TG + '/editMessageText', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(b)
      });
      return new Response(await r.text(), { headers: { ...ch, 'Content-Type': 'application/json' } });
    }

    if (p === '/health') {
      return new Response(JSON.stringify({ ok: true, service: 'DONA Bot' }), {
        headers: { ...ch, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not found', { status: 404, headers: ch });
  }
};
