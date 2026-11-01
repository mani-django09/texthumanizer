export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[]; // array of paragraphs (plain text, rendered as <p>)
  headings?: { after: number; text: string }[]; // insert an <h2> after paragraph index N
  publishedAt: string; // ISO date
  readTime: string;
}

import { extraPosts } from './blogPostsExtra';
import { morePosts } from './blogPostsMore';

const basePosts: BlogPost[] = [
  {
    slug: 'why-ai-writing-sounds-robotic',
    title: 'Why AI Writing Sounds Robotic (And How to Actually Fix It)',
    excerpt:
      'AI can draft a paragraph in seconds, but readers can usually tell. Here\'s the actual reason AI text feels stiff — and what fixing it really requires.',
    publishedAt: '2026-08-30',
    readTime: '5 min read',
    content: [
      'Paste any AI-generated paragraph next to something a person wrote off the cuff, and most readers will guess correctly which is which within a sentence or two. It is not that the AI version is wrong — grammatically it is often flawless. It is that it is too even. Every sentence lands at a similar length. Every paragraph builds the same way: setup, elaboration, tidy conclusion. Nothing surprises you.',
      'That evenness is not an accident of bad prompting. It is a direct consequence of how large language models are trained. They are optimized to predict the most statistically likely next word given everything that came before. Predictable is exactly what they are built to be. A human writer, by contrast, brings mood, memory, and a dozen small biases to every sentence — which is precisely what makes real writing feel alive and occasionally uneven in a way that reads as authentic rather than sloppy.',
      'Detectors and human readers key in on the same signals, just at different levels of sophistication. Researchers call the two main ones perplexity and burstiness. Perplexity measures how surprising a given word choice is — AI text tends to pick the safest, most expected word almost every time, which produces low perplexity. Burstiness measures variation in sentence length and complexity across a passage — human writing swings between short, blunt sentences and long, winding ones, while AI drifts toward a comfortable middle length and stays there.',
      'There is a third signal that is more about vocabulary than structure: AI models have favorite words and phrases. "Delve," "moreover," "it is important to note," "navigate the landscape of" — these show up constantly in AI output because they are statistically safe transitions, not because any particular writer favors them. When five different tools all reach for "delve into" in the same paragraph, that is not coincidence. It is the fingerprint of the training data.',
      'So what actually fixes this? Not a thesaurus pass. Swapping "important" for "significant" does not touch sentence rhythm or remove the underlying evenness — it just relocates the same statistical safety to a different word. Real humanizing means rewriting for variation: letting some sentences run long and complex, then cutting hard with something short. It means picking a word because it is the specific, slightly unusual choice a person with an actual point of view would make, not the safest one.',
      'The most reliable results come from combining a genuine rewrite pass — one that targets sentence rhythm and cuts formulaic phrasing — with something no model can fake: a real detail only you would know. A specific anecdote, an actual opinion, a concrete number from your own experience. That layer is what turns "technically human-sounding" into writing that actually reads like a person, because it is.',
      'If you are staring at an AI draft right now trying to decide how much to change, start with the phrases. Cut every "furthermore," "in conclusion," and "it is worth noting" you can find — they add nothing and they are the single easiest tell to catch. Then look at your sentence lengths. If three sentences in a row are all roughly the same size, break the rhythm. Do those two things by hand and you will already be most of the way to text that reads like it came from someone, not something.',
    ],
    headings: [
      { after: 2, text: 'What detectors are actually measuring' },
      { after: 4, text: 'What genuinely fixes it' },
    ],
  },
  {
    slug: 'ai-writing-tells-you-should-know',
    title: '7 AI Writing Habits That Give You Away Instantly',
    excerpt:
      'Certain phrases and patterns show up in AI writing so often they have become dead giveaways. Here is the full list, and why each one happens.',
    publishedAt: '2026-08-30',
    readTime: '4 min read',
    content: [
      'Every writing tool has tells, but AI models have unusually consistent ones — because millions of people are prompting the same handful of models with similar requests, and those models keep reaching for the same statistically safe patterns. If you know what to look for, you can spot AI writing almost on sight. More usefully, you can also go fix it in your own drafts before anyone else notices.',
      'The most obvious tell is the throat-clearing opener. "It is important to note that," "It is worth mentioning," "One cannot overstate the significance of" — these phrases add zero information. They exist because the model needs to start a sentence somehow, and these openers are common enough in training data to feel statistically safe. A real writer with something to say just says it.',
      'Second is the stacked formal connector: furthermore, moreover, additionally, in addition. Human writers use these occasionally, but AI text piles them up because each one is a low-risk way to glue two sentences together without doing the harder work of an actual transition. Cut them and often the sentences connect just fine on their own.',
      'Third, and maybe the most infamous, is "delve." Nobody says "let\'s delve into this" out loud. It became an AI signature phrase almost by accident — a word that was common enough in formal writing to be statistically likely, rare enough in casual writing that its overuse stands out immediately once you notice it.',
      'Fourth is the tidy rule-of-three list inside a sentence: "faster, cheaper, and more efficient," always exactly three items, always in ascending or parallel structure. Real thinking is messier than that. People list two things, or five, or one big thing with a caveat.',
      'Fifth is the summary that restates the introduction almost word for word: "In conclusion, it is clear that X is important because of Y and Z" — where Y and Z are literally the same points made three paragraphs earlier, just reworded. A human conclusion usually adds something: an implication, a next step, a lingering question.',
      'Sixth is uniform paragraph length. Every paragraph runs four to five sentences, no more, no less, like a formula. Human writing paragraphs when the idea runs out, not when a counter hits five.',
      'Seventh, and the hardest to fix by hand, is the flat emotional register. AI text discusses a product launch and a natural disaster in roughly the same measured tone. People\'s writing shifts — gets terser under stress, looser when excited, warmer when personal. Restoring that requires actually caring about what you are writing, which is either the easiest fix on this list or the hardest, depending on how you look at it.',
    ],
    headings: [{ after: 0, text: 'The seven tells' }],
  },
  {
    slug: 'how-ai-detectors-work',
    title: 'How AI Detectors Actually Work (And Why None of Them Are Perfect)',
    excerpt:
      'GPTZero, Turnitin, Copyleaks — they all claim to spot AI text, but the underlying method is more statistical guesswork than certainty. Here is what is actually happening.',
    publishedAt: '2026-08-30',
    readTime: '6 min read',
    content: [
      'Every AI detector on the market is doing some version of the same thing: running your text through a model and asking how surprised that model is by your word choices. The tools differ in training data and thresholds, but the core mechanism — perplexity — is shared across nearly all of them.',
      'Perplexity is a measure of predictability. If a language model can guess your next word correctly most of the time, your perplexity is low, which the detector interprets as a sign of AI authorship — because AI models, remember, are specifically built to choose likely words. If your word choices frequently surprise the model, your perplexity is high, which reads as more human, because genuine human writing deviates from statistical safety constantly, in small idiosyncratic ways.',
      'The second major signal is burstiness, which looks at variation across a passage rather than word by word. A human writer naturally alternates between short and long sentences, simple and complex structures. AI text tends toward a comfortable, consistent middle. Low burstiness paired with low perplexity is the strongest combined signal most detectors use to flag a passage as likely AI-generated.',
      'Beyond these two statistical measures, some detectors — Turnitin and Copyleaks among them — layer in pattern matching against known AI outputs and phrase databases, essentially checking whether your text resembles the specific outputs their training set has seen from GPT-family models, Claude, and others. This is why detector accuracy varies so much depending on which model generated the original text and how recently the detector was updated.',
      'None of this is remotely foolproof, and detector companies will tell you as much if you read their documentation closely. False positives happen constantly, especially to non-native English speakers, whose writing patterns can trend toward the same measured, grammatically careful style that AI models produce — through a completely different, entirely human process of learning English as a second language. False negatives happen too: once AI text has been substantially edited, the statistical signals a detector relies on may no longer be there to measure.',
      'This is the important part to understand if you are worried about a false accusation, or trying to make legitimately AI-assisted work read naturally: detectors are measuring statistical patterns, not truth. A detector cannot know who wrote something. It can only estimate how closely the text resembles known AI output patterns. That estimate can be wrong in both directions, which is exactly why responsible platforms — including this one — frame detector scores as one data point, never as proof.',
      'The most durable way to produce text that reads as human, whether or not a detector ever looks at it, is the same advice writing teachers have given for decades: vary your sentences, choose specific words over safe ones, and put something of yourself into it. Writing like that is simply better writing, and it is the only approach that does not depend on what any particular tool happens to measure this year.',
    ],
    headings: [
      { after: 3, text: 'Where detectors get it wrong' },
      { after: 5, text: 'What this means for you' },
    ],
  },
];

export const blogPosts: BlogPost[] = [...morePosts, ...extraPosts, ...basePosts];

/** Static cover image for a post (also used as its social share image). */
// ?v= busts the week-long image cache when a cover is redrawn.
export const coverFor = (slug: string) => `/images/blog/${slug}.webp?v=3`;

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
