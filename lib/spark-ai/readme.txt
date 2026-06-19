Spark AI Kit - Spark-Stripe
https://sparkbrain.app/docs

FILES
  spark-ai.tsx    Core: useAi, AiWand, AiInput, AiTextarea, configure()
  wands.tsx       Specialized: AiRephraseWand, AiLimitsWand, AiReviseFeatures,
                  AiComparisonWand, AiConfirmWand
  spark-ai.css    Styles for wand animations, tooltips, field wrappers.

HOW IT WORKS
  The kit calls sparkbrain.app's API directly - no server code needed on your end.
  All heavy lifting (AI, prompts, search, rate limiting) runs on our backend.
  Auth is automatic via your domain in production.

SETUP
  1. Copy these files into your project (e.g. lib/spark-ai/).
  2. Your domain (sparkstripe.com) is already registered.
  3. Import and use.

  For local dev (localhost has no Origin):
    import { configure } from './spark-ai';
    configure({ apiKey: process.env.NEXT_PUBLIC_SPARK_AI_API_KEY });

EXAMPLES

  import { AiWand, AiInput, useAi } from './spark-ai';
  import { AiComparisonWand, AiRephraseWand } from './wands';

  -- AI wand button --
  <AiWand
    tooltip="Improve"
    prompt={(v) => `Improve this: ${v}`}
    value={text}
    onResult={setText}
  />

  -- Input with built-in wand --
  <AiInput
    value={title}
    onChange={setTitle}
    prompt={(v) => `Improve this title: "${v}"`}
    placeholder="Product name"
  />

  -- Rephrase wand (backend handles the prompt) --
  <AiRephraseWand value={text} onChange={setText} />

  -- Competitor comparison table --
  <AiComparisonWand appName="My App" domain="sparkstripe.com" />

  -- Programmatic access --
  const { available, loading, ask, action } = useAi();
  const reply = await ask('Summarize this');
  const result = await action('rephrase', { value: 'Some text' });
