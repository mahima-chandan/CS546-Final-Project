# Sports Wagering Technical Reference 

An informal and frequently changing container for policy, requirements, design notes, sketches, etc.
in order to help out with building this product.

### Team members

- Madeline Rys
- Christian Wettre
- Mahima Chandan
- Dale Pippert
- Amrutha Ravi

### GitHub URLs

#### Sports wagering project site

<a href="https://github.com/madelinerys/CS546-Final-Project">
https://github.com/madelinerys/CS546-Final-Project</a>

#### Sports wagering project proposal 

<a href="https://github.com/madelinerys/CS546-Final-Project/blob/main/doc/ProjectProposalSportsWagering.pdf">
https://github.com/madelinerys/CS546-Final-Project/blob/main/doc/ProjectProposalSportsWagering.pdf
</a>

#### Sports wagering database proposal

Original is available here: 
<a href="https://github.com/madelinerys/CS546-Final-Project/blob/main/doc/DatabaseProposalSportsWagering.pdf">
https://github.com/madelinerys/CS546-Final-Project/blob/main/doc/DatabaseProposalSportsWagering.pdf
</a>

However this is no longer being maintained. Instead the database schema has been incorporated into
this document.

#### Sports wagering technical reference (this document) 

<a href="https://github.com/madelinerys/CS546-Final-Project/blob/main/doc/TechnicalReferenceSportsWagering.md">
https://github.com/madelinerys/CS546-Final-Project/blob/main/doc/TechnicalReferenceSportsWagering.md
</a>

<a href="https://github.com/madelinerys/CS546-Final-Project/blob/main/doc/TechnicalReferenceSportsWagering.pdf">
https://github.com/madelinerys/CS546-Final-Project/blob/main/doc/TechnicalReferenceSportsWagering.pdf
</a>

<div class="page"/>

## Terminology

**Admin.** A user with additional privileges over those of a normal user. The data model
as submitted does not have a flag for this, but needs one.

**Bet**. A monetary value in dollars you are investing, in the hopes of winning some percentage
return on your investment.

**Bettor.** Used interchangeably with user, player.

**BYE**. A week where a given team does not play.

**House.** This is the sponsor or owner of the game. A player bets against the house. If a player
wins a bet they get the house's money for that bet. If a player loses a bet they are losing it
to the house. For example, if our system was adopted by the State of New York, U.S., then New York
state government would be the house.

**Juice.** See vigorish.

**Line.** A catch-all term to describe types of bets. For an example of lines,
see https://www.espn.com/nfl/lines.

**NFL.** National Football League, http://nfl.com.

**OFF**. Some games do not have posted betting lines for various reasons. These are
considered "off" games and cannot be bet.

**Player.** See bettor.

**PPP.** Project Pitch Proposal.

**Push.** A tie with the house. The player is refunded their original bet amount in full.

**Resolve.** A bet is considered resolved when either the player has won and been credited
with the winning amount, *or* has lost the bet, *or* has pushed in which case there money is
refunded.

**Surcharge.** See vigorish.

**User.** See bettor.

**Vig.** See vigorish.

**Vigorish.** This is a surcharge tacked onto bets. In a perfect world this is how the house
makes money. Vigorish is only returned to the player on bets won, not bets lost. On bets lost,
the house keeps the vigorish which is their primary means for realizing revenue from the activity.

**Wager**. See bet.

<div class="page"/>

## Technologies

I believe the professor introduces us to Bootstrap in the weeks ahead. Never used personally. However it may offer
needed assistance for the "responsive" requirement. So I was going to propose we stick to:

- Bootstrap (which brings with it jQuery and Popper whether you want them or not)
  (Note: I'm waivering on this, if we don't need responsive I would suggest leaving
  Bootstrap out.)
- Node.js and Express (required)
- Handlebars
- Axios (needed for API to sports information)
- Bcrypt (encrypt password)
- Mongo (required)
- HTML (required)
- Javascript (required)
- CSS (required)

NOTE: Do we need "responsive"? I can't seem to find that requirement anymore. If we don't need
it then we don't need Bootstrap.

I'm proposing we stay away from front-end frameworks such as React/Angular. Not enough time
for me/us to learn these technologies. If we go down in flames we should do it with technologies
that are covered in the class, if for no other reason hopefully the professor shows
some empathy.

<div class="page"/>

## Clone GitHub projet and get started

Some steps to get up and running from a cold start.

1. Clone the GitHub project to an empty directory which will be your project directory.
Project is located https://github.com/madelinerys/CS546-Final-Project.

1. Start your local mongodb server running. I run on default 27017 port.

3. Run ```npm install``` from your directory you picked in 1. above.

1. From project directory run ```node app.js```. It should start up and say something
like this: We've now got a server!  Your routes will be running on http://localhost:3000.
Current lines available on http://localhost:3000/api/lines/nfl

1. Go to browser (I use Chrome) http://localhost:3000. It should bring up a stub login page.

1. Christian will work on ```Make bets``` (see views/bet.handlebars, routes/bet.js, data/bet.js).

1. Madelaine will work on ```History``` (I think only history.handlebars available so far, create the rest as you go).

1. Mahima is doing ```Fund account``` (see views/fund.handlebars, routes/fund.js, create whatever else).

1. Amrutha is doing everything login/logout/authentication.

1. app.js has set up a session you will have to add to it if you need session storage to remember things.

1. See Tech Reference the .md file (I do not update the .pdf regularly) for more details about what else to do
or chat on Slack with questions.

## System rules

A list of rules that don't necessarily pertain to any one page or database collection but
rather are more global in nature.

1. Whole dollars only. Do not display or deal with cents anywhere. Any rounding/truncation that needs
to occur should be done in a direction that favors the house.

1. U.S. dollars only, we will not deal with international currencies or cryptocurrencies.

1. Over/under and straight bets are made with a 10% surcharge (vigorish).
This charge is not returned on bets lost, but is returned on bets won.

The next several sections cover database collections. Refer to this document for
information on database from now on, the database proposal document has been subsumed here.
This keeps everything in one place without having to spend time on cross-referencing or
trying to guess what is covered in which document.

<div class="page"/>

## Bets collection

Stores bets. Each document is a bet from a bettor aka user. Bettors use the system's 
user interface to enter bets. As the bets are entered, the system stores them to this
collection.

Bets are made against lines. This collection as originally submitted in the database
proposal was designed to store
a *reference* to a line for each bet made. This has been changed to
now store the actual value of the line.

### **Bets schema**

<table>
  <thead>
    <tr>
      <th>Field</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>_id</code></td>
      <td>ObjectId</td>
      <td>Mongo-generated key for the document</td>
    </tr>
    <tr>
      <td><code>bettorid</code></td>
      <td>ObjectId</td>
      <td><code>_id</code> of the bettor from <a href="#users">Users</a> collection</td>
    </tr>
    <tr>
      <td><code>gameid</code></td>
      <td>String</td>
      <td><code>gameid</code> of the game as returned from <a href="#lines">Lines</a> API</td>
    </tr>
    <tr>
      <td><code>bettype</code></td>
      <td>String</td>
      <td>type of bet, one of: AML, ASP, HML, HSP, OV, UN [1]</td>
    </tr>
    <tr>
      <td><code>num</code></td>
      <td>Number</td>
      <td>the player's <em>number</em>, the meaning of which depends on the <em>bettype</em>.</td>
    </tr>
    <tr>
      <td><code>amount</code></td>
      <td>Number</td>
      <td>dollar amount of the bet</td>
    </tr>
    <tr>
      <td><code>pays</code></td>
      <td>Number</td>
      <td>dollars this bet pays on a bettor win</td>
    </tr>
    <tr>
      <td><code>collects</code></td>
      <td>Number</td>
      <td>total dollars this bet collects on a bettor win; this
          is equal to amount + pays</td>
    </tr>
    <tr>
      <td><code>paid</code></td>
      <td>Number</td>
      <td>dollar amount this bet collected, or null if bet is still live; may
      be zero indicating this bet has resolved and was a loss for the bettor [2]</td>
    </tr>
    <tr>
      <td><code>entered</code></td>
      <td>Date</td>
      <td>time and date of the bet</td>
    </tr>
    <tr>
      <td><code>resolved</code></td>
      <td>Date</td>
      <td>time and date the bet resolved, or null if bet is still live [2]</td>
    </tr>
    <tr>
      <td colspan="3">Notes</td>
    </tr>
    <tr>
      <td colspan="3">
        <ol style="margin-left:-20px">
          <li>
            <ul>
              <li>AML Away Money Line.</li>
              <li>ASP Away Spread.</li>
              <li>HML Home Money Line.</li>
              <li>HSP Home Spread</li>
              <li>OV  Over.</li>
              <li>UN  Under.</li>
            </ul>
          <li>These fields are necessary in order for the system to know whether it
          has resolved the bet or not.</li>
        </ol>
      </td>
    </tr>
  </tbody>
</table>

### **Bets example document**

```
{
  _id: "5eeb5b6186fbfca1f18ed313",
  bettorid: "5ee77f8c75ee6029745ca8ac",
  gameid: "ari-sea-2020-11-19",
  bettype: 'ASP',
  num: 3,
  amount: 77,
  pays: 70,
  collects: 147,
  paid: null,
  entered: "2020-11-17T15:30:22",
  resolved: null
}
```

<div class="page"/>

## Scores collection

Fka Games collection.

Each document captures a single NFL game final score.
An NFL season is 17 consecutive weeks, with 14 games per week, so
at the conclusion of a full regular season (not counting postseason),
this collection would have 17 * 14 = 238 documents in it.
The system inserts final scores into the collection in an automated
fashion, as they become avaialable.

Score documents may be inserted with a null ```awayScore``` and null
```homeScore```. After the game is played, a system background job is
responsible for updating ```awayScore``` and ```homeScore``` with the game's
final score.

### **Scores schema**

<table>
  <thead>
    <tr>
      <th>Field</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>_id</code></td>
      <td>String</td>
      <td>format of awayTeam-homeTeam-date-of-game (see example document)</td>
    </tr>
    <tr>
      <td><code>gameDate</code></td>
      <td>String</td>
      <td>YYYY-MM-DD</td>
    </tr>
    <tr>
      <td><code>awayTeam</code></td>
      <td>String</td>
      <td>designator for away (visiting) team</td>
    </tr>
    <tr>
      <td><code>homeTeam</code></td>
      <td>String</td>
      <td>designator for home team</td>
    </tr>
    <tr>
      <td><code>week</code></td>
      <td>Integer</td>
      <td>Week of the season, 1-17. NFL weeks start on Tuesday and end on
      Monday. As a frame of reference, 10/21/2020 is in Week 7. If you want
      to know, for example, what is the <em>current week right now</em> as a frame
      of reference, you can go <a href="https://www.espn.com/nfl/schedule">here</a> and it
      should default to bring up the current week pre-selected.</td>
    </tr>
    <tr>
      <td><code>awayScore</code></td>
      <td>Integer</td>
      <td>Away team final score or null if game not complete or not yet updated.</td>
    </tr>
    <tr>
      <td><code>homeScore</code></td>
      <td>Integer</td>
      <td>Home team final score or null if game not complete or not yet updated.</td>
    </tr>
  </tbody>
</table>

<div class="page"/>

### **Scores example document**

```
{
  _id: "htx-kan-2020-09-10",
  gameDate: "2020-09-10",
  week: 1,
  awayTeam: "hou",
  awayScore: 20,
  homeTeam: "kc",
  homeScore: 34
}
```

### **Scores notes**

1. NFL is the <a href="http://www.nfl.com">National Football League</a>.

1. GMT is four hours ahead of EDT, and five hours ahead of EST. For example,
1:00 PM EST is 6:00 PM GMT.

1. Designators for teams defined in <a href=#teams>Teams</a> collection as
```Teams.abbrv```.

<div class="page"/>

<h2 id="users">Users collection</h2>

These are users aka bettors that have signed up.

Fka bettors. Changed name to users to better fit the fact that adminstrators
can also be in the collection. Anyone can bet however, even adminstrators.

### **Users schema**

<table>
  <thead>
    <tr>
      <th>Field</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>_id</code></td>
      <td>ObjectId</td>
      <td>Mongo-generated key for the document</td>
    </tr>
    <tr>
      <td><code>username</code></td>
      <td>String</td>
      <td></td>
    </tr>
    <tr>
      <td><code>pwd</code></td>
      <td>String</td>
      <td>bcrypt hash of password</td>
    </tr>
    <tr>
      <td><code>role</code></td>
      <td>Number</td>
      <td>0 for regular bettor; 1 for admininistrator</td>
    </tr>
    <tr>
      <td><code>balance</code></td>
      <td>Number</td>
      <td>dollar balance in account</td>
    </tr>
</tbody>
</table>

### **Users example document**

```
{
  _id: "3e85908c9dad05d2589ae104",
  username: "foghorn5",
  role: 0,
  pwd: "$2a$16$7JKSiEmoP3GNDSalogqgPu0sUbwder7CAN/5wnvCWe6xCKAKwlTDq",
  balance: 250.00
}
```

<div class="page"/>

<h2 id="teams">Teams collection</h2>

A seeded reference collection to store static identities for all 32 NFL teams. This
collection has exactly 32 documents in it, one per team. Currently not implemented
and right now does not seem to be a strong need for it.

### **Teams schema**

<table>
  <thead>
    <tr>
      <th>Field</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>_id</code></td>
      <td>ObjectId</td>
      <td>Mongo-generated key for the document</td>
    </tr>
    <tr>
      <td><code>abbrv</code></td>
      <td>String</td>
      <td>three-letter unique business key to enhance readability</td>
    </tr>
    <tr>
      <td><code>fran</code></td>
      <td>String</td>
      <td>franchise name, typically locale/city/state of team</td>
    </tr>
    <tr>
      <td><code>nn</code></td>
      <td>String</td>
      <td>team nickname</td>
    </tr>
  </tbody>
</table>

### **Teams example document**

```
{
  _id: "5f85808c9dad05d358aae011",
  abbrv: "ten",
  fran: "Tennessee",
  nn: "Titans"
}
```
<div class="page"/>

## Settings collection

A single-document collection used for runtime state, where said state needs to persist.
Currently not used except for possible debugging and simulation needs which may require it.

### **Settings schema**

<table>
  <thead>
    <tr>
      <th>Field</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>_id</code></td>
      <td>ObjectId</td>
      <td>Mongo-generated key for the document</td>
    </tr>
    <tr>
      <td><code>simdate</code></td>
      <td>String</td>
      <td>A date in the past, or null. If not null, the Lines API uses this date
      to bring back Lines that are valid for this date. This is needed so that
      during debugging, testing, and doing demos, the user can bet on games
      that have already occurred. Which in turn, is necessary in order for
      the scoring engine to decision the bets as win, lose, or push. Format
      example: "2020-11-23"</td>
    </tr>
  </tbody>
</table>

### **Settings example document**

```
{
  _id: "982580bc9d0306d358aael8f", 
  simdate: "11-25-2020"
}
```

## Lines API

Lines API  is available from application as:
http://localhost:3000/api/lines/nfl

This API is what the rendering logic for display of betting page must use, via handlebars.

### Example return from Lines API

Only shows two games coming back, there will usually be up to 14 except on Mondays
when there may only be one (for Monday night game).

```
  [
  {
    "gameid": "ari-sea-2020-11-19",
    "gameTime": "8:20 PM",
    "gameDate": "Thursday, November 19",
    "gameDateJulian": 1605835200000,
    "lineDate": "20201117221505",
    "awayShort": "ari",
    "awayML": 150,
    "awayPts": 3,
    "over": 57.5,
    "awayLong": "Arizona Cardinals",
    "homeShort": "sea",
    "homeML": -170,
    "homePts": -3,
    "under": 57.5,
    "homeLong": "Seattle Seahawks"
  },
  {
    "gameid": "phi-cle-2020-11-22",
    "gameTime": "1:00 PM",
    "gameDate": "Sunday, November 22",
    "gameDateJulian": 1606068000000,
    "lineDate": "20201117221505",
    "awayShort": "phi",
    "awayML": 160,
    "awayPts": 3.5,
    "over": 45.5,
    "awayLong": "Philadelphia Eagles",
    "homeShort": "cle",
    "homeML": -180,
    "homePts": -3.5,
    "under": 45.5,
    "homeLong": "Cleveland Browns"
  },
  ]
```

<div class="page"/>

## Betting page

Normal users would be directed straight here after login. This is where they make their bets.

The main and most important page of the application. It is composed of an account balance
text box at the top and a series of betting panels below that.

The rest of the page has 12-16 betting panels with clear separation between each one.
They are arranged veritically one after another. All must be visible at the same time
i.e. the page could be reduced greatly by having a drop down to select which
single betting panel
to view at a time, but that will not satisfy. The user must be able to see all panels and the
state of each panel on the page by simply scrolling their device.

### Account balance operation

1. Displays account balance for the current user from `Users.balance`.

1. Input control is some type of read only large text box with large font.

1. Label clearly states this is the user's balance.

1. I see it having larger font that what is available on the betting panel.

1. User cannot type in this account balance text box, it is disabled from any changes. Only the
application can make changes to it.

1. Balance is whole dollars only.

### Betting panel sketch

Only one betting panel shown. The page itself has up to 16 of these, one per game that week,
arranged vertically one after another with clear delineation between them (e.g., space,
or color change or something visual to break them up).

<img src="./images/BettingPanel.png"/>

### Betting panel operation

1. Input for this panel is sourced from http://localhost:3000/api/lines/nfl which then
must be rendered through a handlebars view and out to the user.

1. Submit button enables only when one or more of the 18 text boxes contains
a non-zero amount, and is disabled otherwise.

1. BET and WIN text boxes work together. They start out empty. User chooses, by typing
in _one_ of these two boxes, how much they either want to BET, or WIN.

    a. If the user enters a BET amount, a javascript onchanged event in the page will populate the WIN box
with this BET amount, minus 10%, rounded to whole dollars that favors the house. Both BET and WIN
boxes can remain enabled throughout. For example, user enters $25 in BET amount. 10% of $25 is $2.50 which
is the house surcharge, but rounded up to favor the house this becomes $3 surcharge not $2.50. $25 - $3 =
a WIN amount of $22.

    b. If the user enters a WIN amount, the BET box will update with the WIN amount, plus 10%. Both the WIN box
and the BET box will remain enabled. For example, the user enters a WIN amount of $20. 10% of $20 is $2, so
the BET amount will update via javascript to $22.

1. The COLLECT box always shows BET amount plus WIN amount, and updates off javascript events.

1. All text to left of Bet/Win columns is either static to the template page
or static as rendered from the database. User cannot change this static text.

1. User will be prompted after pressing Submit, e.g., "You are about to wager
$212 on this game. Are you sure?" Y/N buttons.

1. Bets against panels that have a ```gateDateJulian``` value less than
the current Julian date must be disallowed. This check should be done on the front end
and back end both.

1. User will receive confirmation once Submit has sucessfully processed on the
backend by insert bet into Bets collection. User's balance will deduct by
amount of wager. Confirmation can be
as simple as Alert box saying: "Your wager totalling $212 is in!".

    a. Pressing *Continue* dismisses confirmation box and returns user to
the betting screen.

    b. Pressing *Logout* logs user out and returns application to
the login screen ready for the next customer.

    c. Perhaps we change Submit button to *Start Again* so that user does
not get confused and try to Submit bets a second time.

1. Once bet has confirmed by the system, the Submit button should change
to a disable button called *Confirmed* and leave it at that. There was a time
when this spec considered applying additional bets on top of the one just
confirmed, on the same panel, but we no longer have time for that.

1. Submit must occur by AJAX callback so as to a) meet requirement of
the project per professor and 2) so that screen does not have to flash as
it reloads all other live panels (one panel per game). The AJAX call should only
result in the current panel refreshing.

1. Leaving the page to say Fund Account and then returning to the page to resume
betting will result in all entered data, confirmed and unconfirmed, vanishing
from the page. We do not have time to sessionize this page data at this point.

1. Panel is shown in its already smallest dimension with only one panel
stationed horizontally per row. On larger screens the panels should to
some extent "unstack" and start to appear horizontally, perhaps two or
three of them will fit horizontally. This is to demonstate that our application
is *responsive* which is another requirement. (NOTE: Check this, I can't
find this requirement anywhere.)

1. This page generally has 1-16, one for each game for that week but depending
on when the page is pulled up some of the games may have already played and
are therefore not available for betting. Panels are
arranged responsively but on a small screen they would stack vertically one
after the other with comfortable space between each. A drop down where you
would first select one of the up to 16 games then only that panel appears does not
feel right to me which is why I want all live panels to display at once. Bettors
need to be able to see in one fell swoop what the lines are, what looks appealing
to bet on, and what they have already bet on.

1. Lines displayed for the betting panel are read from routes in the system
that are in turn connected to a real-time API, NOT from the Lines collection.
Repeating, do not use Lines collection to populate fields in betting panel, use API
which is available from: http://localhost:3000/api/lines/nfl. Lines collection
will eventually be populated but this collection is strictly for use by
the API and not for use by the application proper.

1. The exact number of betting panels on the page can vary due to several
factors. You may for example wager on a Friday, in which case if there
was a Thursday night game that week, it will not be available for betting.
Other reasons for the varying panels can include BYE week considerations,
or OFF games due to player injuries or what have you.
Generally it should run from 12-16 panels for
any given week of the season. The logic should not rely on having a fixed
number of panels per week as it can and will vary. The number of panels
appearing on the page is data-driven.

<div class="page">

## Authentication

This includes a page for *Sign up or sign in*, *logout operation*,
a *Logout confirmation* indication of some sort, handling of AuthCookie,
and middleware in app.js to check for authenticated user.

Sign up/Sign in is the landing page for the application. Unlike some applications, you are
not allowed to do anything until you sign in. If you don't have an account
you can sign up here.

1. Information to be entered for new users (sign up flow) must be enough to
populate a new document entry in the `Users` collection.

1. New users will need to enter a password (twice to make sure no typos). The PPP spoke
of having state-of-the-art security, so this password should have some restrictions on
it as per next rule.

1. Password must have at least 1 upper, 1 lower, 1 non-letter (number or special character),
and be at least 8 characters long.

1. CAPTCHA (i.e., "I'm not a robot") would be a nice touch but we did not
commit to this. Look into it if you would like to do so or time permitting.

1. Successful sign up takes user to the fund account page. 

1. Successful sign in takes user to the betting page unless their balance is $0
in which case it should go to the Fund account page.

1. No support for exceptional cases, such as:

    a. forgot password,

    b. password expired,

    c. can't remember if I have already signed up or not,

    d. change password.

1. Nav bar must be hidden or disabled as navigation to other pages and functionality
on the site cannot be allowed to occur until user has been authenticated.

1. Middleware in app.js will kick out any user that is not currently authenticated
and send them back to the login page.

<div class="page">

## Logout page 

1. Would be good to have a final page that confirms (not alert box but an actual
static page) unequivocably that you have been officially logged off the system.
After all you have provided your credit card, you don't want the next person to
use it do you?

1. Before rendering this page you must erase the AuthCookie on server side.

1. Page should not have any navigation menu enabled or visible except Login
as (probably easiest) a standalone button.

## Fund account operation aka payment portal

These rules not in chronological order.

1. Page should display user's current balance in text box same as or similar
to what is done on betting page. This balance is pulled from ```Users.balance```
field in database. Can use AJAX or Handlebars or both your choices.

1. Only available to users who are already authenticated with the system.

1. Users chooses between several offered credit card types e.g.,  Mastercard,
VISA, AmEx, Discover, ??

1. User enters amount to add to their current balance. Whole dollars only. Amount
is entered into a textbox labelled ```Funding amount```.

1. User enters credit card number, expiry month/year, CVV, first name, last name.
All in their own text boxes properly labelled for accessibility.

1. Some validation provided for card number e.g. VISA and Mastercard are each
16 digits long.

1. User submits transaction to the system.

1. System delays for a bit then returns a simple confirmation and simultaneously
update the current balance text box with the amount just funded.

1. This page backend is updating collection `Users.balance` for the current user.

1. In real life this page is making an actual credit card transaction. We are
simulating that experience only.

1. Except for displaying user's balance at the top of the page, you can get
ideas for this page from anywhere on the web that you buy things with
your credit card. This is just a generic payment screen nothing special
towards sports betting except for displaying the user's balance.

1. In real life we would be taking mostly cash not credit card payments. Perhaps
one could show that somehow on the page e.g., "Put in your $5, $10, or $20 below."
with an image of a cash collector or something. First cut not worried about this but
I think it would be a nice touch since sports wagering "on premises" would frequently
be a cash business just like buying lottery tickets is a cash business.

<div class="page">

## Player history

This page shows history of bets for a player, including win/loss and financials.
Backend will query bets collection for current authenticated user, and bring back
a formatted page of tabular results, one row for each bet made.

Can default to chronological ordering of bets. Nice to have ability to sort by column
but I don't believe we signed up for that so only do time-permitting.

<div class="page">

## Work Breakdown

Thoughts I have is that it's best to have each team member take on a particular feature
in a "full stack" manner meaning they are responsible for user interface,
the Express routes, and getting whatever data is needed in and out of Mongo. I think working
at a distance with a short calendar this has the best chance of success. Team members can
work mostly independently on their piece initially. Comments? 

We would then identify the main pieces of functionality and team members would volunteer
what they want to take on.

<table>
<tbody>
<tr>
  <th>Item</th><th>Developer</th>
</tr>

<tr>
  <td>Project Proposal</td><td>Dale</td>
</tr>

<tr>
  <td>Project Database Proposal</td><td>Dale</td>
</tr>

<tr>
  <td>Project Pitch Proposal</td><td>Madeline</td>
</tr>

<tr>
  <td>Betting Panel, full stack</td><td>Christian</td>
</tr>

<tr>
  <td>Fund account via credit card, full stack</td><td>Mahima</td>
</tr>

<tr>
  <td>Authentication including Sign in or Sign up, AuthCookie, middleware validation, logout</td><td>Amrutha</td>
</tr>

<tr>
  <td>Player betting history</td><td>Madeline</td>
</tr>

<tr>
  <td>API to betting lines including database storage</td><td>Dale</td>
</tr>

<tr>
  <td>API to game results (scores) including database storage</td><td>Dale</td>
</tr>
</tbody>
</table>

## Business

### Target market

Our end target market is state governments who are looking to expand into sports betting
as a means to increase revenue into the state. We are looking to possibly partner
with established organizations (including potential competitors) to license our software
into their betting terminals and kiosks.

Deployment for betting terminals and kiosks would be gas stations, convenience stores,
newstands, and the like.

<img alt="Example betting kiosks" src="./images/Kiosks.png"/>

### Potential competitors

1. William Hill
1. Scientific Games
1. Fan Duel
1. Draft Kings
1. International Game Technology
    - https://www.igt.com/products-and-services/sportsbetting
1. And others (see PPP).
