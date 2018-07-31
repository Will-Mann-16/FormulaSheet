import React from "react";
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import Navbar from "./Navbar";
import HomePage from "./HomePage";
import QuestionsPage from "./QuestionsPage";
import CreateQuestionPage from "./CreateQuestionPage";
import EditQuestionPage from "./EditQuestionPage";
import EquationsPage from "./EquationsPage";
import 'katex/dist/katex.min.css';


class App extends React.Component {
    render() {
        return  (
          <BrowserRouter>
            <Switch>
              <Route path="/">
                <React.Fragment>
                  <Navbar/>
                  <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/questions" component={QuestionsPage} />
                    <Route exact path="/questions/new" component={CreateQuestionPage} />
                    <Route path="/questions/:id" component={EditQuestionPage} />
                    <Route exact path="/equations" component={EquationsPage} />
                  </Switch>
                </React.Fragment>
              </Route>
              <Route path="/dashboard">
                <Switch>

                </Switch>
              </Route>
            </Switch>
          </BrowserRouter>
        )
    }
}



export default App;
