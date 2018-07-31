import React from "react";

import "./index.css";

export default props => {
  return (
    <div className="tournament-bracket">
      <div className="item">
        <div className="item-parent">
          <div className="item-content winner">Team A</div>
        </div>
        <div className="item-childrens">
          <div className="item-child">
            <div className="item">
              <div className="item-parent">
                <div className="item-content winner">Team A</div>
              </div>
              <div className="item-childrens">
                <div className="item-child">
                  <div className="item">
                    <div className="item-parent">
                      <div className="item-content loser">
                        Team B is also pretty long...
                      </div>
                    </div>
                    <div className="item-childrens">
                      <div className="item-child">
                        <div className="item-content winner">
                          Team B is also pretty long...
                        </div>
                      </div>
                      <div className="item-child">
                        <div className="item-content loser">
                          Team C with an annoyingly long name
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item-child">
                  <div className="item-content winner">Team A</div>
                </div>
              </div>
            </div>
          </div>
          <div className="item-child">
            <div className="item">
              <div className="item-parent">
                <div className="item-content loser">Team D</div>
              </div>
              <div className="item-childrens">
                <div className="item-child">
                  <div className="item">
                    <div className="item-parent">
                      <div className="item-content loser">Team E</div>
                    </div>
                    <div className="item-childrens">
                      <div className="item-child">
                        <div className="item-content winner">Team E</div>
                      </div>
                      <div className="item-child">
                        <div className="item-content loser">Team F</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item-child">
                  <div className="item-content winner">
                    Team D<div />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
