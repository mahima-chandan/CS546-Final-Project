For debugging, testing, simulation, and demoing. These lines are seeded
into the Lines collection and already integrated into logic in Lines API
in conjunction with a setting called simdate. Do not query these lines
either from these flat files or the Lines collection. AT ALL TIMES the only
source for lines must be the Lines API at http://localhost:3000/api/lines/nfl.