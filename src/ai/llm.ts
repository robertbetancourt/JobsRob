export async function generateStructuredAnalysis(systemPrompt: string, userPrompt: string, options: { delayMs?: number, maxRetries?: number } = {}): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }

  const defaultDelay = options.delayMs || 0;
  const maxRetries = options.maxRetries || 5;

  let attempt = 0;
  
  while (attempt <= maxRetries) {
    attempt++;
    
    if (defaultDelay > 0 && attempt === 1) {
       await new Promise(r => setTimeout(r, defaultDelay));
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.0 }
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return JSON.parse(data.candidates[0].content.parts[0].text);
    }

    const errText = await response.text();
    let errJson;
    try { errJson = JSON.parse(errText); } catch(e) {}

    if (response.status === 429) {
      let retryDelayMs = 60000; // default 60s for 429
      if (errJson?.error?.details) {
        const retryInfo = errJson.error.details.find((d: any) => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo');
        if (retryInfo && retryInfo.retryDelay) {
          const seconds = parseInt(retryInfo.retryDelay.replace('s', ''), 10);
          if (!isNaN(seconds)) retryDelayMs = (seconds + 1) * 1000;
        }
      }
      if (attempt > maxRetries) throw new Error(`Gemini API Error: 429 - ${errText}`);
      console.log(`[429 Quota Exceeded] Retrying in ${retryDelayMs}ms... (Attempt ${attempt}/${maxRetries})`);
      await new Promise(r => setTimeout(r, retryDelayMs));
      continue;
    }

    if (response.status === 503 || response.status === 500) {
      if (attempt > maxRetries) throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
      const exponentialBackoff = Math.pow(2, attempt) * 2000;
      console.log(`[${response.status} Overloaded] Retrying in ${exponentialBackoff}ms... (Attempt ${attempt}/${maxRetries})`);
      await new Promise(r => setTimeout(r, exponentialBackoff));
      continue;
    }

    throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
  }
}
