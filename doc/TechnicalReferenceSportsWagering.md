## Sports Wagering Technical Reference 

An informal and frequently changing container for policy, requirements, design notes, sketches, etc.
in order to help out with building this thing.

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

<a href="https://github.com/madelinerys/CS546-Final-Project/blob/main/doc/DatabaseProposalSportsWagering.pdf">
https://github.com/madelinerys/CS546-Final-Project/blob/main/doc/DatabaseProposalSportsWagering.pdf
</a>

#### Sports wagering technical reference (this document) 

<a href="https://github.com/madelinerys/CS546-Final-Project/blob/main/doc/TechnicalReferenceSportsWagering.md">
https://github.com/madelinerys/CS546-Final-Project/blob/main/doc/TechnicalReferenceSportsWagering.md
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

**OFF**. Some games do not have posted betting lines for various reasons. These are
considered "off" games and cannot be bet.

**Player.** See bettor.

**Surcharge.** See vigorish.

**User.** See bettor.

**Vig.** See vigorish.

**Vigorish.** This is a surcharge tacked onto bets. In a perfect world this is how the house
makes money. Vigorish is only returned to the player on bets won, not bets lost. On bets lost,
the house keeps the vigorish which is their primary means for realizing revenue from the activity.

**Wager**. See bet.

## Technologies

I believe he covers Bootstrap in the weeks ahead. Never used personally. However it may offer
needed assistance for the "responsive" requirement. So I was going to propose we stick to:

- Bootstrap (which brings with it jQuery and Popper whether you want them or not)
  (Note: I'm waivering on this, if we don't need responsive I would suggest leaving
  Bootstrap out.)
- Node.js and Express (required)
- Axios (needed for API to sports information)
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

## System rules

A list of rules that don't necessarily pertain to any one page or database collection but
rather are more global in nature.

1. Whole dollars only. Do not display or deal with cents anywhere (at least that is
my thought).

1. U.S. dollars only, we will not deal with international currencies or cryptocurrencies.

1. All rounding should be done in a direction to favor the house and slight the user.

1. Over/under and straight bets are made with a 10% surcharge.
This charge is not returned on bets lost, but is returned on bets won.

<div class="page">

## Betting page

Normal users would be directed straight here after login. This is where they make their bets.

The main and most important page of the application. It is composed of an account balance
text box at the top and a series of betting panels below that.

The rest of the page has 12-16 betting panels with clear separation between each one.
They are arranged veritically one after another. All must be visible at the same time
i.e. the page could be reduced greatly by having a drop down to select which single panel
to view but that will not satisfy. The user must be able to see all panels and the
state of each panel on the page by simply scrolling their device.

### Account balance operation

1. Displays account balance for the user from `Bettors.balance`.

1. Input is some type of large text box with large font.

1. Label clearly states this is the user's balance.

1. I see it having larger font that what is available on the betting panel.

1. User cannot type in the text box, it is disabled from any changes. Only the
application can make changes to it.

1. Balance is whole dollars only.

### Betting panel sketch

Only one betting panel shown. The page itself has 14 of these, one per game that week,
arranged vertically one after another with clear delineation between them (e.g., space,
or color change or something visual to break them up).

<img src="./images/BettingPanel.png"/>

### Betting panel operation

1. Input for this panel is from http://localhost:3000/api/lines/nfl.

1. Submit button enables only when one or more of the 18 text boxes contains
a non-zero amount, and is disabled otherwise.

1. BET and WIN text boxes work together. They start out empty. User chooses, by typing
in _one_ of these two boxes, how much they either want to BET, or WIN.

    a. If the user enters a BET amount, the WIN box will update with the BET amount, minus 10%. The BET box will
remain enabled and the WIN box will be disabled in this case.

    b. If the user enters a WIN amount, the BET box will update with the WIN amount, plus 10%. The WIN box will
remain enabled and the BET box will be disabled in this case.

1. The COLLECT box always shows BET amount plus WIN amount.

1. All text to left of Bet/Win columns is either static to the template page
or static as rendered from the database. User cannot change this static text.

1. User will be prompted after pressing Sumbit, e.g., "You are about to wager
$212 on this game. Are you sure?" Y/N buttons.

1. User will receive confirmation once Submit has sucessfully processed on the
backend by insert bet into Bets collection. User's balance will deduct by
amount of wager. Confirmation can be
as simple as "Your wager totalling $212 is in!" Perhaps it is some type of
popup with buttons *Continue* and *Logout* on it.

    a. Pressing *Continue* will dismiss confirmation box and return user to
the betting screen.

    b. Pressing *Logout* will log the user out and return application to
the login screen ready for the next customer.

    c. Perhaps we change Submit button to *Start Again* so that user does
not get confused and try to Submit bets a second time.

1. Submit must occur by AJAX callback so as to a) meet requirement of
the project per professor and 2) so that screen does not have to flash as
it reloads all 14 panels (one panel per game). The AJAX call should only
result in the current panel refreshing.

1. Panel is shown in its already smallest dimension with only one panel
stationed horizontally per row. On larger screens the panels should to
some extent "unstack" and start to appear horizontally, perhaps two or
three of them will fit horizontally. This is to demonstate that our application
is *responsive* which is another requirement. (NOTE: Check this, I can't
find this requirement anywhere.)

1. This page has 14 panels, one for each game for that week. Panels are
arranged responsively but on a small screen they would stack vertically one
after the other with comfortable space between each. A drop down where you
would first select one of 14 games then only that panel appears does not
feel right to me which is why I want all 14 panels to display at once. Bettors
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
number of panels per week as it can and will vary.

<div class="page">

## Sign up or sign in

This is the landing page for the application. Unlike some applications, you are
not allowed to do anything until you sign in. If you don't have an account
you can sign up here.

1. Information to be entered for new users (sign up flow) must be enough to
populate a new document entry in the `Bettors` collection.

1. New users will need to enter a password.

1. CAPTCHA (i.e., "I'm not a robot") would be a nice touch but we did not
commit to this. Look into it if you would like to do so or time permitting.

1. Successful sign in or sign up takes user to the betting page.

<div class="page">

## Fund account operation

These rules not in chronological order.

1. Page should display user's current balance in text box same as or similar
to what is done on betting page.

1. Only available to users who are already authenticated with the system.

1. Users chooses between several offered credit card types e.g.,  Mastercard,
VISA, AmEx, Discover, ??

1. User enters amount to add to their current balance. Whole dollars only.

1. User enters credit card number, expiry month/year, CVV, name, address.

1. Some validation provided for card number e.g. VISA and Mastercard are each
16 digits long.

1. User submits transaction to the system.

1. System delays for a bit then returns a simple confirmation and simultaneously
update the current balance text box with the amount just funded.

1. This page backend is updating `Bettors.balance` for the current user.

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
  <td>Sign in or Sign up, full stack</td><td>Amrutha</td>
</tr>

<tr>
  <td>Player history</td><td>Madeline</td>
</tr>

<tr>
  <td>API to betting lines including database storage</td><td>Dale</td>
</tr>

<tr>
  <td>API to game results including database storage</td><td>Dale</td>
</tr>
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
