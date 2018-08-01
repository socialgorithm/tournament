export const SAMPLE_STATS = {
  "options": {
    "maxGames": 100,
    "timeout": 100
  },
  "started": true,
  "finished": false,
  "matches": [
    {
      "uuid": "569aa6e7-3f0e-4598-9cf5-1e06bc1dccb0",
      "stats": {
        "games": 0,
        "ties": 0,
        "wins": [
          0,
          0
        ],
        "times": [],
        "timeouts": [
          0,
          0
        ],
        "state": "finished",
        "winner": 0
      },
      "players": [
        {
          "token": "P1"
        },
        {
          "token": "P2"
        }
      ],
      "parentMatches": []
    },
    {
      "uuid": "32f3fcc6-f95a-444f-95c7-e1a444d42de0",
      "stats": {
        "games": 0,
        "ties": 0,
        "wins": [
          0,
          0
        ],
        "times": [],
        "timeouts": [
          0,
          0
        ],
        "state": "finished",
        "winner": 1
      },
      "players": [
        {
          "token": "P3"
        },
        {
          "token": "P4"
        }
      ],
      "parentMatches": []
    },
    {
      "uuid": "1e99ccf5-0aee-4021-91b5-f9f60597a587",
      "stats": {
        "games": 0,
        "ties": 0,
        "wins": [
          0,
          0
        ],
        "times": [],
        "timeouts": [
          0,
          0
        ],
        "state": "finished",
        "winner": 1
      },
      "players": [
        {
          "token": "P1"
        },
        {
          "token": "P4"
        }
      ],
      "parentMatches": [
        {
          "playerIndex": 0,
          "parent": "569aa6e7-3f0e-4598-9cf5-1e06bc1dccb0"
        },
        {
          "playerIndex": 1,
          "parent": "32f3fcc6-f95a-444f-95c7-e1a444d42de0"
        }
      ]
    },
    {
      "uuid": "6ffd617d-d05f-4083-aaae-29248e20215f",
      "stats": {
        "games": 0,
        "ties": 0,
        "wins": [
          0,
          0
        ],
        "times": [],
        "timeouts": [
          0,
          0
        ],
        "state": "finished",
        "winner": 0
      },
      "players": [
        {
          "token": "P2"
        },
        {
          "token": "P3"
        }
      ],
      "parentMatches": []
    },
    {
      "uuid": "67ae864c-23e6-4ed2-b4b7-b158cbca5f09",
      "stats": {
        "games": 0,
        "ties": 0,
        "wins": [
          0,
          0
        ],
        "times": [],
        "timeouts": [
          0,
          0
        ],
        "state": "finished",
        "winner": 0
      },
      "players": [
        {
          "token": "P1"
        },
        {
          "token": "P2"
        }
      ],
      "parentMatches": [
        {
          "playerIndex": 1,
          "parent": "6ffd617d-d05f-4083-aaae-29248e20215f"
        }
      ]
    },
    {
      "uuid": "5964348d-4819-46d0-82fb-6b2d66c159b1",
      "stats": {
        "games": 0,
        "ties": 0,
        "wins": [
          0,
          0
        ],
        "times": [],
        "timeouts": [
          0,
          0
        ],
        "state": "upcoming",
        "winner": -1
      },
      "players": [
        {
          "token": "P4"
        },
        {
          "token": "P1"
        }
      ],
      "parentMatches": [
        {
          "playerIndex": 0,
          "parent": "1e99ccf5-0aee-4021-91b5-f9f60597a587"
        },
        {
          "playerIndex": 1,
          "parent": "67ae864c-23e6-4ed2-b4b7-b158cbca5f09"
        }
      ]
    }
  ],
  "ranking": [
    "P1",
    "P4",
    "P2",
    "P3"
  ]
};