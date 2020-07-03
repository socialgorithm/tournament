import { expect } from "chai";

import { MatchOptions, Player } from "@socialgorithm/model";
import { DoubleEliminationMatch } from "./DoubleEliminationMatch";
import DoubleEliminationMatchmaker from "./DoubleEliminationMatchmaker";

describe("Double Elimination Matchmaker", () => {
    const p1 = "P1";
    const p2 = "P2";
    const p3 = "P3";
    const p4 = "P4";
    const p5 = "P5";
    const matchOptions: MatchOptions = { maxGames: 100, timeout: 100, autoPlay: true };

    it("matches even number of players", done => {
        const matchmaker = new DoubleEliminationMatchmaker([p1, p2, p3, p4], matchOptions);
        const allMatches: DoubleEliminationMatch[] = [];
        let matches: DoubleEliminationMatch[] = [];
        const shuffledPlayers : Player[] = matchmaker.getPlayers();
        const sp1 = shuffledPlayers[0];
        const sp2 = shuffledPlayers[1];
        const sp3 = shuffledPlayers[2];
        const sp4 = shuffledPlayers[3];

        // Round 1
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([sp1, sp2]);
        expect(matches[1].players).to.deep.equal([sp3, sp4]);
        // parents
        expect(matches[0].parentMatches).to.have.length(0);
        expect(matches[1].parentMatches).to.have.length(0);

        // Round 2
        matches[0].winner = 0; // sp1
        matches[1].winner = 1; // sp4
        matches[0].state = "finished";
        matches[1].state = "finished";
        matchmaker.updateStats(allMatches);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([sp1, sp4]); // winning bracket
        expect(matches[1].players).to.deep.equals([sp2, sp3]); // losing bracket
        // parents
        expect(matches[0].parentMatches).to.have.length(2);
        expect(matches[1].parentMatches).to.have.length(0);
        expect(matches[0].parentMatches).to.deep.equal([
            {
                playerIndex: 0,
                parent:  allMatches[0].matchID, // SP1-SP2
            },
            {
                playerIndex: 1,
                parent: allMatches[1].matchID, // SP3-SP4
            },
        ]);

        // Round 3
        matches[0].winner = 1; // sp4
        matches[1].winner = 0; // sp2
        matches[0].state = "finished";
        matches[1].state = "finished";
        matchmaker.updateStats(allMatches);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([sp1, sp2]);
        // parents
        expect(matches[0].parentMatches).to.have.length(1);
        expect(matches[0].parentMatches).to.deep.equal([
            {
                playerIndex: 1,
                parent: allMatches[3].matchID, // SP2-SP3
            },
        ]);

        // Round 4
        matches[0].winner = 0; // sp1
        matches[0].state = "finished";
        matchmaker.updateStats(allMatches);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([sp4, sp1]);
        // parents
        expect(matches[0].parentMatches).to.have.length(2);
        expect(matches[0].parentMatches).to.deep.equal([
            {
                playerIndex: 0,
                parent: allMatches[2].matchID, // SP1-SP4
            },
            {
                playerIndex: 1,
                parent: allMatches[4].matchID, // SP1-SP2
            },
        ]);

        done();
    });

    it("matches odd number of players", done => {
        const matchmaker = new DoubleEliminationMatchmaker([p1, p2, p3, p4, p5], matchOptions);
        const allMatches: DoubleEliminationMatch[] = [];
        let matches: DoubleEliminationMatch[] = [];
        const shuffledPlayers : Player[] = matchmaker.getPlayers();
        const sp1 = shuffledPlayers[0];
        const sp2 = shuffledPlayers[1];
        const sp3 = shuffledPlayers[2];
        const sp4 = shuffledPlayers[3];
        const sp5 = shuffledPlayers[4];

        // Round 1
        expect(matchmaker.getRanking()).to.deep.equal(shuffledPlayers);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([sp1, sp2]);
        expect(matches[1].players).to.deep.equal([sp3, sp4]);

        // Round 2
        matches[0].winner = 0; // sp1
        matches[1].winner = 0; // sp3
        matchmaker.updateStats(allMatches);
        expect(matchmaker.getRanking()).to.deep.equal([sp1, sp3, sp2, sp4, sp5]);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([sp5, sp1]); // winning bracket
        expect(matches[1].players).to.deep.equals([sp2, sp4]); // losing bracket

        // Round 3
        matches[0].winner = 0; // sp5
        matches[1].winner = 0; // sp2
        matchmaker.updateStats(allMatches);
        expect(matchmaker.getRanking()).to.deep.equal([sp3, sp5, sp1, sp2, sp4]);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([sp3, sp5]);
        expect(matches[1].players).to.deep.equal([sp1, sp2]);

        // Round 4
        matches[0].winner = 0; // sp3
        matches[1].winner = 0; // sp1
        matchmaker.updateStats(allMatches);
        expect(matchmaker.getRanking()).to.deep.equal([sp3, sp1, sp5, sp2, sp4]);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([sp1, sp5]);

        // Round 5
        matches[0].winner = 0; // sp1
        matchmaker.updateStats(allMatches);
        expect(matchmaker.getRanking()).to.deep.equal([sp3, sp1, sp2, sp5, sp4]);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([sp3, sp1]);

        // Round 6
        matches[0].winner = 1; // sp1
        matchmaker.updateStats(allMatches);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        // tslint:disable-next-line:no-unused-expression
        expect(matches).to.be.empty;

        // Test Ranking
        expect(matchmaker.getRanking()).to.deep.equal([sp1, sp3, sp5, sp2, sp4]);

        done();
    });

    it("resolves ties", done => {
        const matchmaker = new DoubleEliminationMatchmaker([p1, p2], matchOptions);
        let matches = matchmaker.getRemainingMatches();
        const shuffledPlayers : Player[] = matchmaker.getPlayers();
        const sp1 = shuffledPlayers[0];
        const sp2 = shuffledPlayers[1];
        const sp3 = shuffledPlayers[2];
        const sp4 = shuffledPlayers[3];

        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([sp1, sp2]);

        matches[0].winner = -1; // TIE
        let tiedMatchmatchID = matches[0].matchID;
        matchmaker.updateStats(matches);
        matches = matchmaker.getRemainingMatches();
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([sp1, sp2]);
        expect(matches[0].options.timeout).to.equal(50);
        expect(matches[0].parentMatches).to.deep.equal([{ playerIndex: 0, parent: tiedMatchmatchID }, { playerIndex: 1, parent: tiedMatchmatchID }]);

        matches[0].winner = -1; // TIE
        tiedMatchmatchID = matches[0].matchID;
        matchmaker.updateStats(matches);
        matches = matchmaker.getRemainingMatches();
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([sp1, sp2]);
        expect(matches[0].options.timeout).to.equal(25);
        expect(matches[0].parentMatches).to.deep.equal([{ playerIndex: 0, parent: tiedMatchmatchID }, { playerIndex: 1, parent: tiedMatchmatchID }]);

        done();
    });
});
