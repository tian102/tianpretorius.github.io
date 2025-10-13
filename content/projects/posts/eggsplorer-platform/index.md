---
title: Eggsplorer - Interactive Hunt Platform
description: A web-based platform for creating and running digital scavenger hunts, Easter egg hunts, and trivia challenges with real-time tracking and leaderboards.
tags: [php, mysql, javascript, bootstrap, ajax, web-development]
demo: 
github: https://github.com/tian102/Eggsplorer
coverImage: ./assets/Eggsplorer.png
date: 2025-10-10
---

# Eggsplorer - Interactive Hunt Platform

A full-stack web application that transforms traditional scavenger hunts into interactive digital experiences. Built for Easter events, it combines online challenges with physical hunting through a two-phase system: solve the puzzle, find the egg, claim your points.

![Eggsplorer Banner](./assets/Eggsplorer.png)

## The Story Behind It

This started as a "wouldn't it be fun if..." idea three weeks before Easter last year. I was hosting and wanted to make the traditional egg hunt more engaging. The first version was rough—buggy, barely functional, held together with duct tape and hope—but people loved it.

This year, I rebuilt it properly. Fixed the bugs, overhauled the UI, added all the features I wished existed last time, and turned it into a real platform that could handle any type of hunt event.

It's definitely over-engineered for a family Easter party, but that's kind of the point. Sometimes you build things not because they're necessary, but because they're interesting.

## How It Works

The concept is simple but effective:

### Two-Phase Challenge System

**Phase 1: The Mental Game**  
Participants solve digital challenges (trivia questions, riddles, math problems, whatever you want) on their phones or computers. Get it right, unlock the location clue.

**Phase 2: The Physical Hunt**  
Once solved, a 10-minute timer starts. They have to find the physical "egg" (could be a QR code, object, location—anything) and claim it before time runs out. No claiming, no points.

This approach:
- Prevents the fastest runner from dominating everything
- Adds tension with the timer countdown
- Works for all ages and skill levels
- Can be played indoors if weather doesn't cooperate
- Creates little moments of excitement ("I got it!" followed by frantic searching)

### Sequential Tasks

Tasks unlock in sequence—you can't skip ahead to easier ones. This keeps everyone progressing at their own pace and prevents one person from hogging all the eggs.

### Persistent Hints

Need help? Reveal a hint. It'll cost you a few points, but once revealed, it stays visible even if you refresh the page. No accidental hint loss like in version 1.

### Live Leaderboards

Points update in real-time (well, every 30 seconds) so everyone can see the competition. Watching people's reactions when they climb the board after claiming an egg never gets old.

## Key Features

### For Participants
- **Clean, Mobile-Friendly Interface**: Works smoothly on phones, tablets, and computers. Built with Bootstrap so it looks decent everywhere.
- **Multiple Event Types**: Easter egg hunts, treasure hunts, scavenger hunts, trivia challenges—same platform, different themes.
- **Progressive Task System**: Tasks unlock in order, each with its own points value and difficulty.
- **Timer-Based Egg Claiming**: 10-minute countdown creates urgency without being overwhelming.
- **Hint System**: Get stuck? Reveal hints for a small point penalty. They persist so you won't lose them.
- **Real-Time Leaderboard**: See your ranking update as you and others claim eggs.
- **Progress Tracking**: Visual indicators show which tasks you've completed and which eggs you've claimed.
- **Automatic Task Reopening**: Timer expired? Task reopens automatically so you can try again.

![User Dashboard](./assets/4.%20logged_in_welcome_page.jpeg)
*Personalized dashboard showing active events and leaderboard*

### For Organizers (Admin Panel)
- **Event Management**: Create events with custom names, descriptions, start/end times, and types.
- **Task Builder**: Add tasks with questions, answers, point values, and sequence ordering.
- **Hint Configuration**: Set up hints with time delays and point costs.
- **User Management**: See who's registered, promote admins, monitor activity.
- **Live Monitoring**: Watch event progress in real-time, see who's stuck, who's winning.
- **JSON Templates**: Export entire events as JSON files, edit them, import for quick setup.
- **Analytics Dashboard**: View completion rates, engagement metrics, and task difficulty analysis.
- **Activity Logs**: Complete audit trail of all user actions for debugging and oversight.

![Admin Dashboard](./assets/8.%20admin_dashboard.jpeg)
*Admin overview with key metrics and system status*

## Technical Overview

### The Stack

Built with technologies I already knew—no time to learn frameworks when Easter's three weeks away:

- **PHP 8**: Server-side logic and session management
- **MySQL**: Database with proper relational structure
- **JavaScript (Vanilla)**: AJAX interactions, timers, dynamic UI updates
- **Bootstrap 5**: Responsive UI framework for consistent styling
- **Chart.js**: Analytics visualizations for the admin dashboard

### Why These Choices?

**PHP/MySQL**: I knew them. XAMPP makes local hosting trivial. No server costs. Works great for small-to-medium events (tested with 100+ concurrent users without issues).

**No Framework**: For something this size, frameworks felt like overkill. Vanilla PHP with good organization is perfectly fine. Plus, I learned more by building the structure myself.

**Bootstrap**: I'm not a designer. Bootstrap makes things look good without requiring design skills. It's responsive out of the box, which matters when everyone's on their phones.

**Vanilla JavaScript**: The interactivity isn't complex enough to justify React/Vue. Event listeners and fetch calls handle everything needed.

## Architecture Highlights

### Database Design

The schema tracks everything needed for a smooth experience:

- **users**: Login credentials, admin status
- **events**: Event details, start/end times, types
- **tasks**: Questions, answers, points, sequence order
- **hints**: Hint text, time delays, point costs
- **event_participants**: Who's in which events, their total points
- **user_tasks**: Task completion status, timestamps, egg claimed status
- **user_hints**: Which hints have been revealed to whom
- **activity_logs**: Full audit trail of all actions

Foreign keys enforce data integrity. Indexes on frequently-joined columns keep queries fast (leaderboard queries run in ~15ms even with lots of participants).

### State Management

The server is the single source of truth for everything that matters:

**Timer Logic**: When you complete a task, we store the timestamp. When you try to claim an egg, we calculate how much time has actually passed server-side. No client-side manipulation possible.

**Points**: All point calculations happen on the server. AJAX calls send the action, server validates and responds with updated totals.

**Progress**: Task completion, egg claiming, hint reveals—all tracked in the database and validated on every action.

The client just displays what the server tells it. Keeps things honest.

### AJAX Layer

Everything that can be async, is:

- Submit answers without page reload
- Reveal hints instantly
- Claim eggs with feedback
- Update leaderboards every 30 seconds
- Leave events gracefully

Each AJAX endpoint validates the session, checks permissions, performs the action, and returns structured JSON. Clean separation of concerns.

### Security

Not trying to protect nuclear codes, but built in common-sense security:

- **SQL Injection Prevention**: Parameterized queries everywhere using PDO
- **CSRF Protection**: Tokens on all forms and AJAX requests
- **XSS Prevention**: All user input sanitized before display
- **Password Security**: bcrypt hashing, never stored plaintext
- **Session Security**: HTTP-only cookies, session regeneration, timeouts
- **Admin Protection**: All admin routes check permissions

Good enough for a family Easter party and then some.

## Development Journey

### Version 1 (Last Year)

Built in about two weeks. Features:
- Basic login/registration
- Task display and answer submission
- Egg hunt timer (that worked... mostly)
- Point tracking (sometimes)
- Minimal UI (functional but ugly)

Problems:
- Timer could be cheated by refreshing
- No admin panel (used phpMyAdmin during event)
- Concurrent claims could cause issues
- Leaderboard rarely updated correctly
- UI was rough on mobile
- I spent the event debugging instead of participating

Result: Everyone had fun anyway. Got great feedback on what to improve.

### Version 2 (This Year)

Complete rebuild over a few months. Added:
- Server-authoritative timers (no more cheating)
- Full-featured admin panel
- Proper AJAX architecture
- Persistent hints
- Clean, responsive UI
- JSON template system
- Analytics dashboard
- Activity logging
- Database optimizations

Result: Actually works reliably. Can participate in events instead of debugging. Looks professional enough that I'm not embarrassed to show people.

### What I Learned

**Start Simple**: Version 1 proved the concept. Version 2 made it good. If I'd tried to build version 2 from scratch, I'd still be working on it.

**User Feedback Matters**: Every complaint from last year became a feature this year. Persistent hints, automatic task reopening, better mobile UI—all from user feedback.

**Good Enough Is Good Enough**: It's not the most elegant code. It's not using cutting-edge tech. But it works, it's maintainable, and people enjoy using it. That's what matters.

**Overengineering Can Be Fun**: Yes, I over-engineered an Easter egg hunt. No regrets. The process of building taught me things, and now I have a reusable platform for any hunt-style event.

## Screenshots

### Event Participation Flow

<table>
  <tr>
    <td width="33%">
      <img src="./assets/5. egg_hunt.jpeg" alt="Event View">
      <p align="center"><em>Event task list and progress tracking</em></p>
    </td>
    <td width="33%">
      <img src="./assets/6. egg_search.jpg" alt="Egg Hunt">
      <p align="center"><em>Egg hunt phase with 10-minute timer</em></p>
    </td>
    <td width="33%">
      <img src="./assets/7. egg_found.jpeg" alt="Success">
      <p align="center"><em>Successful egg claim confirmation</em></p>
    </td>
  </tr>
</table>

### Admin Panel

<table>
  <tr>
    <td width="50%">
      <img src="./assets/9. admin_manage_events.jpeg" alt="Manage Events">
      <p align="center"><em>Event management interface</em></p>
    </td>
    <td width="50%">
      <img src="./assets/11. admin_analytics_dashboard.jpeg" alt="Analytics">
      <p align="center"><em>Analytics dashboard with Chart.js visualizations</em></p>
    </td>
  </tr>
</table>

## Cool Features I'm Proud Of

### JSON Template System

You can export an entire event (tasks, hints, settings) as a JSON file, edit it, and import it to create a new event. Makes testing fast and lets you share event templates.

```json
{
  "event": {
    "name": "Easter Hunt 2025",
    "event_type": "Egg Hunt",
    "start_datetime": "2025-04-20 10:00:00"
  },
  "tasks": [
    {
      "title": "Find the Golden Egg",
      "expected_answer": "golden",
      "points": 100,
      "hints": [
        {"hint_text": "Check the garden"}
      ]
    }
  ]
}
```

The template handler validates everything, uses database transactions for atomicity, and provides clear error messages if something's wrong.

### Automatic Task Reopening

Timer expired before you found the egg? The task automatically reopens via AJAX. You get a notification and can try again. No manual intervention needed.

### Persistent Hint Display

Once a hint is revealed, it stays visible. The database tracks which hints you've seen, so refreshing won't lose them. Small detail, huge UX improvement.

### Real-Time-ish Updates

Leaderboards update every 30 seconds via AJAX polling. Not true real-time (that would need WebSockets), but feels responsive enough and keeps server load reasonable.

### Admin Analytics

The analytics dashboard shows:
- Event completion rates
- Average time per task
- Hint usage patterns (indicates task difficulty)
- Participant engagement over time

Built with Chart.js, looks professional, actually useful for tuning event difficulty.

## Challenges Overcome

### The Timer Problem

**Challenge**: Client-side timers can be manipulated (refresh page, change system clock).

**Solution**: Store task completion timestamp in database. Calculate elapsed time server-side on every page load and when claiming eggs. JavaScript timer is just for display.

### Concurrent Claims

**Challenge**: Multiple people claiming same egg simultaneously could cause race conditions.

**Solution**: Database transactions with row locking in the claim endpoint. First to commit wins, others get an error message.

### Stale Leaderboard Data

**Challenge**: Leaderboards showing outdated info after point awards.

**Solution**: AJAX polling every 30 seconds. After claiming an egg, immediately trigger a leaderboard update. Simple caching prevents database hammering.

### Mobile UI Issues

**Challenge**: Complex layouts breaking on small screens, buttons too small, timers not visible.

**Solution**: Bootstrap's grid system and mobile-first approach. Tested extensively on actual phones (borrowed from family members). Adjusted button sizes and spacing based on feedback.

## What I'd Do Differently

If I were starting over with what I know now:

**Use a Framework**: Laravel or Symfony would give me routing, auth, ORM, and testing tools out of the box. I learned a lot building from scratch, but it took way longer.

**Write Tests**: Zero automated tests. Everything tested manually. Next time: PHPUnit for backend, proper test coverage.

**Better Error Handling**: Used basic try-catch and error_log(). Should use a proper logging library with levels.

**Implement Caching Earlier**: Added caching after performance issues appeared. Should have planned for it from the start.

**Git From Day One**: Version 1 had sporadic commits. Version 2 better, but still not great. Future projects: proper Git workflow from line one.

## Future Ideas

Features that would be fun to add:

- **Mobile App**: React Native version with push notifications when tasks unlock
- **QR Code Integration**: Scan QR codes at locations to automatically claim eggs
- **Team Mode**: Compete in teams with shared progress
- **Photo Verification**: Upload photos as proof of finding eggs
- **Multi-Language Support**: Interface text in multiple languages
- **Social Features**: Share achievements, invite friends
- **Difficulty Modes**: Easy/medium/hard versions of same event

But honestly? It does what it needs to do now. Might add these if there's demand, might not. Sometimes "done" is better than "perfect."

## Links and Resources

- **GitHub Repository**: [github.com/tian102/Eggsplorer](https://github.com/tian102/Eggsplorer)
- **Full Documentation**: See README.md in the repository for installation, setup, and usage guides

## Final Thoughts

Eggsplorer is what happens when you combine a love for building things with an excuse to over-engineer something fun. It's not going to change the world, but it made my family's Easter better, taught me a bunch, and gave me something to work on during downtime.

Sometimes the best projects are the ones that make people smile. This one definitely does that.

If you end up using it for your own event, I'd love to hear about it. And if you find bugs (you probably will), feel free to open an issue or submit a PR. It's a hobby project, but I'm always up for making it better.

---

**Tech Stack**: PHP • MySQL • JavaScript • Bootstrap • AJAX • Chart.js

**Development Time**: ~3 weeks for version 1, ~3 months for version 2 (part-time)

**Lines of Code**: ~15,000 across all files

*Built because I couldn't help myself. Refined because I actually cared. Used because it's genuinely fun.*
