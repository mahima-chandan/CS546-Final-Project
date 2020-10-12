
## Project idea

Our idea is to build a sports betting application that can be OEMed into 
a variety of vendor offerings and compute platforms through our licensing
agreement. Vendors in turn will sell or lease their product containing our
software to convenience stores, gas stations, OTB parlors, or wherever their
market takes them. 

### Team members

- Mahima Chandan
- Dale Pippert
- Amrutha Ravi
- Madeline Rys
- Christian Wettre

### GitHub URL

- TBD

### Core features

- The main core feature of the system is to offer users the ability
to transact sports bets sponsored by some (typically) government entity.

- Initial phase, targeted for release in the December 2020 timeframe,
will support NFL bets only.

- Authenticated users will be presented with their current balance, and
given the opportunity to fund (increase) this balance through a credit card
transaction (simulated for this phase).

- For any user with a balance greater than some specified minimum (e.g. $20),
the system will present the user with a slate of current games for the week.

- Slate will include current betting lines for spread, money line, and point
total (over/under), for each game.

- Another core feature of the system, but not readily appaarent from the
user's perspective, is that the back end will need to integrate
with third-party APIs or other publicly-available feed(s) including
*BOTH* sports wagering data *AND* game results.

- User will be given option to wager on any or all of the offered lines for
each game listed for the current week.

- User will choose amount to bet for each line type, not exceeding
their current balance.

- User will submit bets on a game by game basis.

- User will receive confirmation for each game bet.

- Upon completion of games (batch process or periodic polling, not real time),
system will score winning bets and adjust user current balance accordingly.

- No cash out options for this phase are provided.

- User may display a history of betting activity (win/loss) for
themselves including current bets outstanding.

- Back end (server) is decoupled from front end (user interface) such that
bets may be entered programmatically via other unspecified third-party systems.

- No parlay, teaser, future, half game, or other proposition bets are supported.

### Extra features

- Hooks (disabled buttons) will be provided for other major sports such as
MLB, MLS, NBA, and NHL.

- Admin login, the database will earmark users as being role 'user' or role
'admin'.

- Develop a betting simulator (The Betting Public) that can randomly generate
sports bets from a population of users and send these bets into the system
without access to the UI.

- Ability for role 'admin' to display at least two reports contents of which
is TBD but one report should include house P & L.

- Ability for role 'admin' to display user history for any user.