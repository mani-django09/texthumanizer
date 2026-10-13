import type { BlogPost } from './blogPosts';

export const extraPosts: BlogPost[] = [
  {
    slug: 'edit-ai-draft-checklist',
    title: 'How to Edit an AI Draft So It Sounds Like You: A 15-Minute Checklist',
    excerpt:
      'A practical, ordered checklist for turning a flat AI draft into something you would actually put your name on, with or without a tool.',
    publishedAt: '2026-10-06',
    readTime: '6 min read',
    content: [
      "An AI draft is a starting point, not a finished piece. The good news is that most of what makes it read as machine-written is concentrated in a handful of habits, and you can fix them in a fixed order. Work through the steps below from top to bottom. The early ones are fast and remove the most obvious problems; the later ones take longer and are where the piece becomes yours.",
      "Minutes 0 to 2: cut the throat-clearing. Search the draft for openers such as \"It is important to note that\", \"In today's world\", \"When it comes to\" and \"It is worth mentioning\". Delete each one and start the sentence at the actual point. Nothing of value is lost, and the draft immediately reads more directly.",
      "Minutes 2 to 4: remove stacked connectors. AI drafts lean on \"Furthermore\", \"Moreover\" and \"Additionally\" to glue sentences together. Keep one if the logic really needs it. Otherwise delete it, or merge the two sentences. People connect ideas with the content itself far more often than with a signpost word.",
      "Minutes 4 to 7: break the rhythm. Read one paragraph aloud. If every sentence lands at roughly the same length, that evenness is what your reader is hearing. Split one long sentence into two short ones. Combine two short ones into a longer one with a clause. Aim for a mix: a few words, then twenty, then ten.",
      "Minutes 7 to 10: replace generic claims with specifics. \"Many companies have seen significant benefits\" could be about anything. Which company, what benefit, how much? If you know the specific, write it. If you do not, cut the sentence, because a vague claim adds length without adding information.",
      "Minutes 10 to 13: add one thing only you could write. This is the step no tool can do for you. Add an example from your own work, an opinion you actually hold, or a detail you observed. One real paragraph changes how the whole piece is read, because it gives the reader a person to listen to.",
      "Minutes 13 to 15: fix the ending. AI conclusions tend to restate the introduction, starting with \"In conclusion\". Delete the restatement. End on the most useful sentence you have: the recommendation, the next step, or the consequence.",
      "Where does a humanizer fit? It automates the middle of this list. A rewrite pass handles the filler phrases, the connectors and the sentence rhythm in a few seconds, which leaves your fifteen minutes for the two steps that matter most: the specifics and the part only you can add. Use the diff view to check what changed, and regenerate any single sentence that drifted from what you meant.",
      "One last check before you publish or submit: accuracy and rules. Rewriting changes wording, not facts, so confirm every number and name against your source. And if the piece is for a class, an employer or a publication, check their policy on AI-assisted writing first. Good editing makes a draft better; it does not replace telling people how the draft was made when they have asked to know.",
    ],
    headings: [
      { after: 1, text: 'The fast fixes: phrases and connectors' },
      { after: 3, text: 'The fixes that make it yours' },
      { after: 7, text: 'Where a tool helps, and where it does not' },
    ],
  },
  {
    slug: 'ai-humanizer-vs-paraphrasing-tool',
    title: 'AI Humanizer vs. Paraphrasing Tool: What Is the Difference?',
    excerpt:
      'They sound similar and overlap in practice, but they are built for different jobs. Here is how to tell which one your draft actually needs.',
    publishedAt: '2026-10-06',
    readTime: '5 min read',
    content: [
      "Paraphrasing tools and AI humanizers both take text in and give different text back, so it is fair to ask whether the distinction is just marketing. It is not, quite. They start from different goals, and the goal decides what the tool changes and what it leaves alone.",
      "A paraphrasing tool is built to say the same thing in different words. Its job is done when the wording no longer matches the original. It works mostly at the level of words and phrases: synonyms, reordered clauses, active swapped for passive. That is useful when you need to restate a source in your own words, simplify a dense passage, or avoid repeating yourself.",
      "A humanizer is built to change how the text reads, not just which words it uses. Its target is the pattern that makes machine-written prose feel flat: sentences of similar length, stock transitions, generic phrasing and an even, unchanging tone. So it works at the level of sentences and paragraphs. It will shorten one sentence and lengthen the next, drop a filler opener entirely, and replace a formal connector with nothing at all.",
      "You can see the difference on one sentence. Take \"It is important to note that regular exercise plays a crucial role in maintaining overall health.\" A paraphraser might return \"It should be noted that consistent physical activity is vital for preserving general wellbeing.\" Every word changed, and it reads exactly as stiff as before. A humanizer is more likely to return \"Regular exercise keeps you healthy.\" Fewer words changed in spirit, but the filler is gone and it sounds like a person.",
      "Neither tool changes your facts, and neither should. If the output says something your original did not, that is an error to fix, not a feature. This is why a diff view matters: you should be able to see exactly what was removed and added, and put back anything that shifted the meaning.",
      "Which one do you need? If the problem is that your wording is too close to a source, or too complicated for your audience, you want paraphrasing, plus a citation if the ideas are not yours. If the problem is that the draft is correct but reads like a template, you want humanizing. And if the only problem is typos and agreement errors, you want neither: a grammar checker fixes mistakes without touching your style.",
      "A note on what these tools are not. Rewording someone else's work does not make it yours; ideas need attribution however the sentences are arranged. And no rewriting tool can promise how a particular checker, teacher or editor will judge the result. The honest use of both is the same: start from your own ideas or properly cited sources, and use the tool to make the writing clearer and more natural.",
    ],
    headings: [
      { after: 0, text: 'What a paraphrasing tool does' },
      { after: 2, text: 'The same sentence, two results' },
      { after: 4, text: 'Which one your draft needs' },
    ],
  },
  {
    slug: 'words-that-sound-ai-generated',
    title: '12 Words and Phrases That Make Writing Sound AI-Generated (and What to Write Instead)',
    excerpt:
      'A working list of the phrases readers have learned to associate with AI text, why each one grates, and a plainer alternative for every entry.',
    publishedAt: '2026-10-06',
    readTime: '6 min read',
    content: [
      "None of the phrases below is wrong. People wrote all of them long before language models existed. The problem is frequency: models reach for them constantly, so readers have started to treat them as a signature. If a draft contains several, it will read as generated even if you wrote every word. Here are twelve worth searching for, grouped by the job they are trying to do.",
      "Openers that delay the point. (1) \"It is important to note that\": delete it and start with the thing that is important. (2) \"In today's fast-paced world\": it sets no scene and could open any article; start with your actual subject. (3) \"When it comes to\": replace \"When it comes to pricing, clarity matters\" with \"Clear pricing matters\". (4) \"It is worth noting that\": if it is worth noting, note it.",
      "Connectors that announce structure. (5) \"Furthermore\" and (6) \"Moreover\": usually removable with no loss; if the second sentence builds on the first, the reader can tell. (7) \"Additionally\": try \"also\", placed mid-sentence, or simply start the next sentence. (8) \"On the other hand\": fine once, when you are truly contrasting two things; \"but\" does the same job in one word.",
      "Metaphors that have worn out. (9) \"Delve into\": write \"look at\", \"explain\" or \"examine\". (10) \"Navigate the landscape of\": name the real action, such as \"choose between\" or \"deal with\". (11) \"A testament to\": say what it shows. \"The launch is a testament to the team's work\" becomes \"The launch shows how hard the team worked\".",
      "Endings that announce themselves. (12) \"In conclusion\" or \"In summary\": readers can see that it is the last paragraph. Cut the label and make the final sentence carry something new: the recommendation, the consequence, or what to do next.",
      "Why these and not others? They share two traits. Each is a safe, formal, all-purpose choice, which is exactly what a system trained to predict the most likely next words will prefer. And each can be removed without changing the meaning of the sentence, which tells you it was never doing much work.",
      "Do not over-correct. Stripping every transition makes writing choppy, and replacing each phrase with a fancier synonym just moves the problem. The goal is not to avoid a banned list. It is to make each sentence start at its point and use the plainest words that are accurate. If a \"however\" is the clearest way to mark a real turn in the argument, keep it.",
      "A quick way to audit a draft: paste it into a tool that highlights these phrases as you type, count them, and fix the paragraph with the most first. Then read the piece aloud. Any sentence you would never say to a colleague is a candidate for rewriting, whether or not it is on this list.",
    ],
    headings: [
      { after: 0, text: 'Openers and connectors' },
      { after: 2, text: 'Worn-out metaphors and labelled endings' },
      { after: 4, text: 'Why these phrases, and how far to go' },
    ],
  },
  {
    slug: 'using-ai-for-school-and-work-writing',
    title: 'Using AI for School and Work Writing: A Practical Guide to Doing It Honestly',
    excerpt:
      'AI can speed up drafting without replacing your thinking. A plain guide to what is generally fine, what is not, and how to check the rules that apply to you.',
    publishedAt: '2026-10-06',
    readTime: '6 min read',
    content: [
      "Most people who write for school or work now use AI somewhere in the process, and most of the anxiety around it comes from not knowing where the line is. There is no single line. Rules differ between institutions, between courses in the same institution, and between employers. What follows is a way to think about it that holds up under most of those rules, plus the questions to ask when you are unsure.",
      "Start with the policy, not the tool. Before you use AI on an assignment or a client deliverable, find out what has actually been said. A syllabus may ban it, allow it for brainstorming only, or allow it with disclosure. An employer may restrict it because of confidentiality rather than authorship. If nothing is written down, ask. A one-line question to an instructor or manager is cheaper than any misunderstanding later.",
      "Uses that are widely accepted tend to share one feature: the thinking is still yours. Asking for an outline you then rework, getting an explanation of a concept you then verify, checking grammar, tightening a paragraph you wrote, or rewording a stiff sentence are all forms of help people have long received from editors, tutors and software.",
      "Uses that cause trouble also share a feature: they hand in work as yours when the substance is not. Submitting a generated essay on a topic you have not engaged with, presenting generated analysis as your own reasoning, or inventing sources fall on the wrong side almost everywhere. So does pasting confidential material into a tool your employer has not approved.",
      "Disclosure solves more than people expect. Where AI help is allowed, a short note covers you: which tool you used and for what. \"I used an AI tool to check grammar and tighten wording; the argument and sources are my own\" is honest, takes ten seconds and removes the question entirely. If you find yourself reluctant to write that sentence, that reluctance is useful information about whether the use was appropriate.",
      "Always verify. Language models produce confident text, not checked facts. Every statistic, quotation, date and reference in an AI-assisted draft needs to be confirmed against a real source you have opened yourself. Fabricated citations are the single most common way AI use goes wrong, and they are entirely avoidable.",
      "Where do rewriting tools fit? A humanizer or grammar checker improves how your text reads. That is editing, and it is appropriate for the same things editing has always been appropriate for: making your own ideas clearer. It does not change who did the thinking, and it is not a way around a rule that asks you to disclose or avoid AI. Detection tools, for their part, are estimates that can be wrong in both directions, which is one more reason to rely on being able to explain and show your process rather than on any score.",
      "A simple test to finish with: could you explain the piece, defend its claims and describe how you produced it, to the person who will read it? If yes, you are almost certainly fine. If not, the fix is not better wording. It is doing more of the work yourself.",
    ],
    headings: [
      { after: 1, text: 'What is generally fine, and what is not' },
      { after: 3, text: 'Disclose, and verify everything' },
      { after: 5, text: 'Where editing tools fit' },
    ],
  },
];
