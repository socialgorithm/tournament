import { expect } from "chai";

import { MatchOptions } from "@socialgorithm/model";
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

        // Round 1
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([p1, p2]);
        expect(matches[1].players).to.deep.equal([p3, p4]);
        // parents
        expect(matches[0].parentMatches).to.have.length(0);
        expect(matches[1].parentMatches).to.have.length(0);

        // Round 2
        matches[0].winner = 0; // p1
        matches[1].winner = 1; // p4
        matches[0].state = "finished";
        matches[1].state = "finished";
        matchmaker.updateStats(allMatches);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([p1, p4]); // winning bracket
        expect(matches[1].players).to.deep.equals([p2, p3]); // losing bracket
        // parents
        expect(matches[0].parentMatches).to.have.length(2);
        expect(matches[1].parentMatches).to.have.length(0);
        expect(matches[0].parentMatches).to.deep.equal([
            {
                playerIndex: 0,
                parent:  allMatches[0].matchID, // P1-P2
            },
            {
                playerIndex: 1,
                parent: allMatches[1].matchID, // P3-P4
            },
        ]);

        // Round 3
        matches[0].winner = 1; // p4
        matches[1].winner = 0; // p2
        matches[0].state = "finished";
        matches[1].state = "finished";
        matchmaker.updateStats(allMatches);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([p1, p2]);
        // parents
        expect(matches[0].parentMatches).to.have.length(1);
        expect(matches[0].parentMatches).to.deep.equal([
            {
                playerIndex: 1,
                parent: allMatches[3].matchID, // P2-P3
            },
        ]);

        // Round 4
        matches[0].winner = 0; // p1
        matches[0].state = "finished";
        matchmaker.updateStats(allMatches);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([p4, p1]);
        // parents
        expect(matches[0].parentMatches).to.have.length(2);
        expect(matches[0].parentMatches).to.deep.equal([
            {
                playerIndex: 0,
                parent: allMatches[2].matchID, // P1-P4
            },
            {
                playerIndex: 1,
                parent: allMatches[4].matchID, // P1-P2
            },
        ]);

        done();
    });

    it("matches odd number of players", done => {
        const matchmaker = new DoubleEliminationMatchmaker([p1, p2, p3, p4, p5], matchOptions);
        const allMatches: DoubleEliminationMatch[] = [];
        let matches: DoubleEliminationMatch[] = [];

        // Round 1
        expect(matchmaker.getRanking()).to.deep.equal(["P1", "P2", "P3", "P4", "P5"]);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([p1, p2]);
        expect(matches[1].players).to.deep.equal([p3, p4]);

        // Round 2
        matches[0].winner = 0; // p1
        matches[1].winner = 0; // p3
        matchmaker.updateStats(allMatches);
        expect(matchmaker.getRanking()).to.deep.equal(["P1", "P3", "P2", "P4", "P5"]);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([p5, p1]); // winning bracket
        expect(matches[1].players).to.deep.equals([p2, p4]); // losing bracket

        // Round 3
        matches[0].winner = 0; // p5
        matches[1].winner = 0; // p2
        matchmaker.updateStats(allMatches);
        expect(matchmaker.getRanking()).to.deep.equal(["P3", "P5", "P1", "P2", "P4"]);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(2);
        expect(matches[0].players).to.deep.equal([p3, p5]);
        expect(matches[1].players).to.deep.equal([p1, p2]);

        // Round 4
        matches[0].winner = 0; // p3
        matches[1].winner = 0; // p1
        matchmaker.updateStats(allMatches);
        expect(matchmaker.getRanking()).to.deep.equal(["P3", "P1", "P5", "P2", "P4"]);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([p1, p5]);

        // Round 5
        matches[0].winner = 0; // p1
        matchmaker.updateStats(allMatches);
        expect(matchmaker.getRanking()).to.deep.equal(["P3", "P1", "P2", "P5", "P4"]);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([p3, p1]);

        // Round 6
        matches[0].winner = 1; // p1
        matchmaker.updateStats(allMatches);
        matches = matchmaker.getRemainingMatches();
        allMatches.push(...matches);
        // tslint:disable-next-line:no-unused-expression
        expect(matches).to.be.empty;

        // Test Ranking
        expect(matchmaker.getRanking()).to.deep.equal(["P1", "P3", "P5", "P2", "P4"]);

        done();
    });

    it("resolves ties", done => {
        const matchmaker = new DoubleEliminationMatchmaker([p1, p2], matchOptions);
        let matches = matchmaker.getRemainingMatches();
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([p1, p2]);

        matches[0].winner = -1; // TIE
        let tiedMatchmatchID = matches[0].matchID;
        matchmaker.updateStats(matches);
        matches = matchmaker.getRemainingMatches();
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([p1, p2]);
        expect(matches[0].options.timeout).to.equal(50);
        expect(matches[0].parentMatches).to.deep.equal([{ playerIndex: 0, parent: tiedMatchmatchID }, { playerIndex: 1, parent: tiedMatchmatchID }]);

        matches[0].winner = -1; // TIE
        tiedMatchmatchID = matches[0].matchID;
        matchmaker.updateStats(matches);
        matches = matchmaker.getRemainingMatches();
        expect(matches).to.have.lengthOf(1);
        expect(matches[0].players).to.deep.equal([p1, p2]);
        expect(matches[0].options.timeout).to.equal(25);
        expect(matches[0].parentMatches).to.deep.equal([{ playerIndex: 0, parent: tiedMatchmatchID }, { playerIndex: 1, parent: tiedMatchmatchID }]);

        done();
    });
});
