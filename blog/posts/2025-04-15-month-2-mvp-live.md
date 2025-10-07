---
title: "Month 2: MVP is Live (And I'm Absolutely Terrified)"
date: 2025-04-15
author: Tian Pretorius
tags: [journey, mvp, launch, product]
excerpt: "Two months in, and I just shipped my MVP to the first 5 beta users. Here's what I built, what immediately broke, and what I learned about launching before you're ready."
featured: true
---

## The MVP is Live 🚀

After 8 weeks of coding, debugging, second-guessing, and more debugging, I finally clicked "deploy" and sent beta invites to my first 5 users.

**Current status**: Refreshing my email every 30 seconds waiting for feedback. Also absolutely terrified.

**Also**: Production went down 2 hours after launch. Cool cool cool.

## What I Built

Without revealing too much about the product (still in stealth), here's what made it into v1:

### Core Features ✅
- User authentication and onboarding flow
- Main automation workflow (the core value prop)
- Dashboard with real-time updates
- Basic reporting and analytics
- Email notifications (that sometimes work)
- Settings page
- Help documentation (barely)

### What Didn't Make the Cut ❌
- Advanced customization options
- Team collaboration features
- Mobile app (it's mobile-responsive, that counts right?)
- API access
- Advanced analytics
- Integrations with other tools
- That cool AI feature I wanted
- About 73 other "nice to have" features

**Why the cuts?** Because perfect is the enemy of shipped. And I needed to ship.

## Lessons from Shipping an MVP

### 1. You'll Never Feel "Ready"

I wanted to add "just one more feature" approximately 847 times. Each time, I had to remind myself: **the goal isn't perfection, it's validation**.

**The trick**: Ask yourself "Will this feature stop someone from seeing the core value?" 

If no → cut it.

### 2. Real Users Find Bugs You Never Imagined

Within 2 hours of launch:

**User 1**: Found a critical auth bug where logging out... didn't log out. How did I miss that?!

**User 2**: Had a 4K monitor that broke the entire layout. My CSS was not ready.

**User 3**: Wanted a feature I explicitly cut from v1. (This was actually validating!)

**User 4**: Discovered the "delete account" button doesn't work. Oops.

**User 5**: Sent a screenshot of a white screen. No error message. Just... white.

**The upside**: These are REAL problems from REAL users. Way better than my assumptions in isolation.

### 3. The First "It Works!" Message is Pure Gold

When my first beta user sent this:

> "This is exactly what I needed! I've been doing this manually for months."

I literally teared up. All the late nights, the stress, the uncertainty, the bugs... worth it.

## The Numbers (Month 2)

Let me be radically transparent about where things stand:

- **Lines of code written**: ~15,000
- **Lines of code deleted**: ~3,000 (mostly bad ideas)
- **Code commits**: 247
- **Hours worked**: ~280 (yes, I'm working too much)
- **Beta users**: 5 invited, 5 signed up, 4 active daily
- **Revenue**: $0 (it's free beta)
- **Bugs fixed**: 23 (so far)
- **Bugs remaining**: Unknown, but definitely more than 0
- **Sleepless nights**: 4
- **Cups of coffee**: Lost count around 80

## What Actually Broke

Let me tell you about the 2 AM production fire:

### The Redis Incident

At 2:17 AM, I woke up to my phone vibrating with error alerts. The app was down. 

**The problem**: I forgot to set up Redis persistence. So when DigitalOcean restarted the server for maintenance... all session data disappeared. Every user was logged out mid-workflow.

**The fix**: 45 minutes of panic-Googling, followed by properly configuring Redis.

**The lesson**: Set up monitoring AND alerting from day 1. Also, read the docs completely.

### The Email Queue Disaster

Turned out my background task queue wasn't actually processing emails. Users were signing up but not getting confirmation emails.

**How I discovered it**: A user sent me a LinkedIn message asking if the signup worked because they never got an email.

**The problem**: Celery worker wasn't running. Because I forgot to start it.

**The fix**: Deployment checklist. Which I should have had from day 1.

## What's Working

Not everything is broken! Some things actually work:

### The Core Feature

The main automation workflow? It works. It's not perfect, but it solves the problem. And users are using it daily.

### The Onboarding Flow

I spent 3 days on this. It shows. Users are completing onboarding without reaching out for help.

### The Dashboard

It's clean, fast, and intuitive. Users figured it out without documentation. That's a win.

## What's Next

Now comes the hard part: turning beta feedback into a product people will pay for.

### April Goals

1. **Get to 20 beta users** - Need more diverse feedback
2. **Implement top 3 feature requests** - Let users shape the product
3. **Add payment integration** - Time to test willingness to pay
4. **Fix all critical bugs** - No more 2 AM fires
5. **Write documentation** - Real docs, not just inline comments

### Pricing Strategy (Help!)

This is where I'm stuck. How do you price something people are currently doing manually for free?

Options I'm considering:
- $29/month per user
- $99/month per team
- $199/month unlimited

I literally have no idea. Will probably do user interviews to figure this out.

## Advice for Aspiring Solo Founders

If you're building your first product:

### Do This:
✅ **Ship before you're ready** - You'll learn more in 1 day with real users than 1 month of planning

✅ **Start with a tiny beta group** - 5 users is manageable. 500 is overwhelming.

✅ **Collect feedback obsessively** - Every comment is data. Write it all down.

✅ **Celebrate small wins** - Your first signup is huge. Your first "it works!" message is huge.

✅ **Set up monitoring from day 1** - Future you will thank past you.

### Don't Do This:
❌ **Wait for perfection** - It doesn't exist. Ship the 80% version.

❌ **Build in isolation** - Show your work early. Get feedback often.

❌ **Ignore user feedback** - They're literally telling you what to build.

❌ **Forget why you started** - When it gets hard (and it will), remember your "why"

❌ **Skip the deployment checklist** - Learn from my Redis disaster.

## The Emotional Rollercoaster

Real talk: Being a solo founder is mentally exhausting. In a single day, I felt:

- 😊 **Excitement** (new user signup!)
- 😰 **Panic** (production is down!)
- 😤 **Frustration** (why won't this bug reproduce?!)
- 🥳 **Joy** (it's working!)
- 😴 **Exhaustion** (3 AM deploys hit different)
- 😭 **Overwhelm** (so many things to do)
- 💪 **Determination** (I can do this)

**The key**: This is normal. Every founder goes through it. You're not alone.

## Month 3 Preview

Next month's focus: **Converting free beta users to paying customers**. 

This means:
- Finalizing pricing strategy
- Building payment integration
- Creating pricing page
- Having the scariest conversations: "Will you pay for this?"

Also, I need to:
- Actually sleep more than 5 hours
- Go outside (vitamin D is apparently important)
- Talk to humans who aren't users or my laptop

Stay tuned. It's about to get VERY interesting.

---

**What I learned this month**: Shipping an imperfect product is scarier than not shipping at all. But only one of those options leads to building a business.

**Biggest mistake**: Not having a deployment checklist.

**Best moment**: "This is exactly what I needed!"

*Follow my journey from unemployed to (hopefully) profitable SaaS founder. We're just getting started.*

---

**P.S.** If you're building something, I'd love to hear about it. Reply on LinkedIn or send me an email. Let's learn together.
