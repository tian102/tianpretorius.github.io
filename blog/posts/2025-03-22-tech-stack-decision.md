---
title: "The Tech Stack Decision: Choosing Tools That Ship Fast"
date: 2025-03-22
author: Tian Pretorius
tags: [tech, development, productivity, tools]
excerpt: "How I chose my tech stack as a solo founder. Spoiler: I went with 'boring' technology, and here's why that's actually the smartest move."
featured: true
---

## The Paradox of Choice

As a solo founder who's also the sole developer, choosing a tech stack is crucial. Pick the wrong tools, and you'll waste precious time. Pick overly complex tools, and you'll drown in configuration hell.

I spent way too long on this decision. Let me save you the analysis paralysis.

### My Selection Criteria

Here's what mattered to me when choosing my stack:

1. **Speed to ship** - Can I build and deploy fast?
2. **Stability** - Will it break at 2 AM when I'm sleeping?
3. **Familiarity** - Do I already know it (or can I learn it quickly)?
4. **Cost** - As a bootstrapped founder, every dollar counts
5. **Scalability** - Will it work when I have 10,000 users?
6. **Community** - Can I Google my way out of problems?

## The Stack I Chose

After much deliberation (and honestly, some analysis paralysis), here's what I landed on:

### Backend
```python
- Python + FastAPI     # I know Python cold. FastAPI is modern and fast.
- PostgreSQL          # Boring, reliable, handles everything I need.
- Redis               # Caching and background jobs made easy.
- Celery              # Async task processing.
```

**Why?** I've used Python for 6+ years. I can debug it in my sleep. FastAPI has incredible docs and automatic API documentation.

### Frontend
```javascript
- TypeScript + React  # I know React. TypeScript catches bugs early.
- Tailwind CSS        # Utility-first lets me move FAST.
- Vite                # Lightning-fast dev experience.
```

**Why?** React is battle-tested. Tailwind means no context-switching between HTML and CSS files. Vite makes development actually enjoyable.

### Infrastructure
```
- DigitalOcean       # Simple, predictable pricing. Not AWS-level complex.
- GitHub Actions     # Free CI/CD that just works.
- Cloudflare         # Free CDN and DNS in one place.
```

**Why?** I don't need AWS's 200+ services. DO gives me what I need without the complexity tax.

## Why "Boring" Technology Wins

You might notice I didn't choose:
- ❌ The newest JavaScript framework
- ❌ A complex microservices architecture  
- ❌ Kubernetes (overkill for day 1)
- ❌ GraphQL (REST works fine)
- ❌ NoSQL databases (when SQL does the job)

### The "Boring Technology" Principle

Choose technology that:
- ✅ You can debug at 2 AM half-asleep
- ✅ Has Stack Overflow answers for everything
- ✅ Won't disappear in 6 months
- ✅ Doesn't require a DevOps team to manage
- ✅ Has actual documentation (not just "see examples")

**Rule of thumb**: Save the experimentation for side projects. For your business, use what you know.

## Lessons Learned (The Hard Way)

### What Worked

**Starting with what I know** saved me weeks of learning time. I can ship features instead of fighting with unfamiliar tools.

**Tailwind CSS** was a game-changer for solo development. I can style components without leaving my HTML. It's ugly at first, but so fast.

**PostgreSQL** handles WAY more than I initially thought. I almost went with MongoDB "because everyone says it's easier." Glad I didn't.

### What I'd Change

**I spent too much time debating hosting options.** Just pick one and move on! You can always migrate later (but you probably won't need to).

**Should have set up monitoring earlier.** I waited until production. Don't do that. Set it up from day 1.

**Testing framework should have been day-1, not day-30.** Past me was dumb. Test from the start.

## The Anti-Patterns I Avoided

### ❌ Picking Based on Resume Padding
"This will look great on my resume!" is not a valid reason when you're building a business.

### ❌ Following Hype Cycles
That new framework everyone's talking about? It can wait. Ship first, refactor later.

### ❌ Premature Optimization
"What if we have 10 million users?" Cool, but right now you have 0. Build for today's problems.

### ❌ Microservices from Day 1
You don't need microservices. You need a product people want. Start with a monolith.

## For Other Solo Founders

If you're choosing your stack:

### Do This:
1. **Start with what you know** - Learning new tech while validating a business is hard mode
2. **Choose boring, battle-tested tools** - Let other people beta test the bleeding edge
3. **Optimize for shipping** - Perfect is the enemy of launched
4. **You can always refactor** - Get to market first, then make it pretty

### Don't Do This:
1. **Don't pick tech to learn it** - Build your SaaS, then learn on side projects
2. **Don't architect for scale you don't have** - YAGNI (You Aren't Gonna Need It)
3. **Don't ignore the ecosystem** - Pick tech with good docs and active communities
4. **Don't choose based on Twitter hype** - Most "thought leaders" aren't shipping

## The Results

Week 3 update: I've shipped the core features. The boring tech stack means I'm spending time on the product, not fighting my tools.

Would I change anything? Maybe. Ask me in 6 months.

For now, it's working. And that's all that matters.

---

**What I learned**: The best tech stack is the one that helps you ship, not the one that looks best on Hacker News.

**Next post**: Month 2 update - MVP is live and I'm terrified.

*Follow my journey from unemployed to (hopefully) profitable SaaS founder.*
