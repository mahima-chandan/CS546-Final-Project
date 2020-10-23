## Sports Wagering Database Proposal

This document has two purposes. First, it is intended to present our
current understanding of the data and relationships we believe are needed in
order to realize our idea. Second, it serves as first steps for capturing
business requirements, so that stakeholders, and especially team members,
can begin to internalize, agree upon, and get comfortable with the concepts underlying
the data.

### Team members

- Christian Wettre
- Mahima Chandan
- Dale Pippert
- Amrutha Ravi
- Madeline Rys

### GitHub URLs

#### Sports wagering project site

<a href="https://github.com/madelinerys/CS546-Final-Project">
https://github.com/madelinerys/CS546-Final-Project</a>

#### Sports wagering project proposal 

<a href="https://github.com/madelinerys/CS546-Final-Project/blob/main/doc/ProjectProposalSportsWagering.pdf">
https://github.com/madelinerys/CS546-Final-Project/blob/main/doc/ProjectProposalSportsWagering.pdf
</a>

#### Sports wagering database proposal (this document)

<a href="https://github.com/madelinerys/CS546-Final-Project/blob/main/doc/DatabaseProposalSportsWagering.pdf">
https://github.com/madelinerys/CS546-Final-Project/blob/main/doc/DatabaseProposalSportsWagering.pdf
</a>

<div class="page"/>

<h2 id="games">Games collection</h2>

Each document describes a single NFL game, capturing only those few aspects
of a game that are relevant to the system, such as its start date/time,
and final score. An NFL season is 17 consecutive weeks, with 14 games per week, so
this collection for a full season would have 17 * 14 = 238 documents
in it. The system will insert games into the collection in an automated
fashion by either seeding the entire collection all at once or by updating
the collection with new games on a week-by-week basis. Either way, it is
essential that games be entered into this collection at least several days
prior to their start time, so that bettors have a chance to make their
wagers on any games for that week.

Game documents are inserted with a null ```ascore``` and null
```hscore```. After the game is played, a system background job is
responsible for updating ```ascore``` and ```hscore``` with the game's
final score.

#### Games schema

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
      <td><code>away</code></td>
      <td>String</td>
      <td>designator for away (visiting) team</td>
    </tr>
    <tr>
      <td><code>home</code></td>
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
      <td><code>start</code></td>
      <td>Date</td>
      <td>Game start date and time GMT. The system will not allow bets to be
      placed on any game where <code>start</code> is >= current date and time. Upcoming
      games must be inserted into this collection at least several days prior to <code>start</code>,
      so that bettors have a chance to place their wagers on the game.</td>
    </tr>
    <tr>
      <td><code>ascore</code></td>
      <td>Integer</td>
      <td>Away team final score. Null up until when the game has finished and the
      system has processed the final score feed.</td>
    </tr>
    <tr>
      <td><code>hscore</code></td>
      <td>Integer</td>
      <td>Home team final score. Null up until when the game has finished and the
      system has processed the final score feed.</td>
    </tr>
  </tbody>
</table>

<div class="page"/>

#### Games example document

```
{
  _id: "5f8578c116e3409b5b276d50",
  away: "TEX",
  home: "TIT",
  week: 6,
  start: "2020-10-18T17:00:00.000Z"
  ascore: 36,
  hscore: 42
}
```

#### Games notes

1. NFL is the <a href="http://www.nfl.com">National Football League</a>.

1. GMT is four hours ahead of EDT, and five hours ahead of EST. For example,
1:00 PM EDT is 5:00 PM GMT.

1. Designators for teams defined in <a href=#teams>Teams</a> collection as
```Teams.abbrv```.

<div class="page"/>

<h2 id="teams">Teams collection</h2>

A seeded reference collection to store static identities for all 32 NFL teams. This
collection has exactly 32 documents in it, one per team.

#### Teams schema

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

#### Teams example document

```
{
  _id: "5f85808c9dad05d358aae011",
  abbrv: "TIT",
  fran: "Tennessee",
  nn: "Titans"
}
```

<div class="page"/>

<h2 id="lines">Lines collection</h2>

Stores betting lines for each game. The system populates this collection on a week-by-week,
day-by-day basis. It is updated with new lines every day or two via a background job.

#### Lines schema

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
      <td><code>gameid</code></td>
      <td>ObjectId</td>
      <td><code>_id</code> from <a href="#games">Games</a> collection</td>
    </tr>
    <tr>
      <td><code>ltype</code></td>
      <td>String</td>
      <td>AML|HML|ASP|HSP|OV|UN (see notes)</td>
    </tr>
    <tr>
      <td><code>num</code></td>
      <td>Integer</td>
      <td>The number, the meaning of which depends on <code>ltype</code>; may be positive, negative, or 0.</td>
    </tr>
    <tr>
      <td><code>date</code></td>
      <td>Date</td>
      <td>effective date of the line</td>
    </tr>
  </tbody>
</table>

#### Lines example document

```
{
  _id: "5f85808c9dad05d358aae00a",
  gameid: "5f8578c116e3409b5b276d50",
  ltype: "ASP",
  num: -2,
  date: "2020-10-16T00:00:00.000Z",
}
```

<div class="page"/>

#### Lines notes

1. ```ltype``` valid values are:

    a. **AML** Away team money line.

    b. **HML** Home team money line.

    c. **ASP** Away team spread.
    
    d. **HSP** Home team spread.
    
    e. **OV** Over points.

    f. **UN** Under points.

1. There can be many documents for any given ```gameid``` and ```ltype```.

1. For any given ```gameid``` and ```ltype```, the current line for that ```gameid```
and ```ltype``` is the line with the most recent date.

1. For any given ```gameid``` and ```ltype```, bets are always placed against
the line having the most recent date, i.e., the current line.

<div class="page"/>

<h2 id="bets">Bets collection</h2>

Stores bets. Each document is a bet from a bettor aka user. Bettors use the system's 
user interface to enter bets. As the bets are entered, the system stores them to this
collection.

#### Bets schema

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
      <td><code>_id</code> of the bettor from <a href="#bettors">Bettors</a> collection</td>
    </tr>
    <tr>
      <td><code>lineid</code></td>
      <td>ObjectId</td>
      <td><code>_id</code> of the line from <a href="#lines">Lines</a> collection</td>
    </tr>
    <tr>
      <td><code>amount</code></td>
      <td>Number</td>
      <td>dollar amount of the bet</td>
    </tr>
    <tr>
      <td><code>pays</code></td>
      <td>Number</td>
      <td>dollars this bet pays, or null if bet is still live</td>
    </tr>
    <tr>
      <td><code>collects</code></td>
      <td>Number</td>
      <td>total dollars this bet collects should bettor win; this
          is equal to amount + pays</td>
    </tr>
    <tr>
      <td><code>paid</code></td>
      <td>Number</td>
      <td>dollar amount this bet paid, or null if bet is still live; may
      be zero indicating this bet has resolved and was a loss for the bettor</td>
    </tr>
    <tr>
      <td><code>entered</code></td>
      <td>Date</td>
      <td>time and date of the bet</td>
    </tr>
    <tr>
      <td><code>closed</code></td>
      <td>Date</td>
      <td>time and date the bet resolved, or null if bet is still live</td>
    </tr>
  </tbody>
</table>

#### Bets example document

````
{
  _id: "3e85908c9dad05d2589ae104",
  bettorid: "4e9441Cc9dad05d268aff018", 
  lineid: "8015617daebe1773199ec12C",
  amount: 55,
  pays: 50,
  collects: 105,
  paid: null,
  entered: "2020-10-22T14:12:35.738Z",
  closed: null
}
````

<div class="page"/>

<h2 id="bettors">Bettors collection</h2>

These are users aka bettors that have signed up. Possibly (time permitting) seeded with
1000 bettors for demo purposes.

#### Bettors schema

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
      <td>md5 hashed password</td>
    </tr>
    <tr>
      <td><code>balance</code></td>
      <td>Number</td>
      <td>dollar balance in account</td>
    </tr>
</tbody>
</table>

#### Bettors example document

```
{
  _id: "3e85908c9dad05d2589ae104", 
  username: "foghorn5",
  pwd: "d4ec6fe6cec7f63630376c0af7212a52",
  balance: 250.00
}
```

1. Surprisingly, this collection will be seeded with exactly the same 1000 people
from an earlier people.json lab. Apparently they all like to gamble!
