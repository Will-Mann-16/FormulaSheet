import React from "react";
import { graphql, compose } from 'react-apollo';
import { Link } from "react-router-dom";
import { Toggle } from "react-powerplug"
import { Container, Label, Card, Dimmer, Loader, Button, Confirm, Divider, Dropdown } from 'semantic-ui-react';
import gql from "graphql-tag";
import {getColourFromDifficulty, convertToTex, DIFFICULTY_DROPDOWN, toTitleCase, SECONDARY_COLOUR, PRIMARY_COLOUR, TERTIARY_COLOUR} from "./texFunctions";
import _ from "lodash";
import QuestionCard from "./QuestionCard";
class QuestionsPage extends React.Component{
    state = {
        filter: {
            tags: {
                primary: [],
                secondary: [],
                tertiary: []
            },
            difficulty: []
        }
    }
  render(){
      var {tags} = this.props.data;
    if(this.props.data.loading) return (<Dimmer active>
      <Loader />
    </Dimmer>);
      var {tags} = this.props.data;
      tags = JSON.parse(tags);
      return (
      <Container>
          <Button as={Link} to="/questions/new">Add</Button>
          <Dropdown text='Filter' labeled floating button>
            <Dropdown.Menu>
              <Dropdown.Header content='Difficulty' />
              <Dropdown.Menu scrolling>
                  {DIFFICULTY_DROPDOWN.map((option, key) => <Dropdown.Item active={this.state.filter.difficulty.indexOf(option.value) == -1} onClick={() => {
                      var difficultyFilter = this.state.filter.difficulty;
                      if(difficultyFilter.indexOf(option.value) != -1){
                          difficultyFilter.splice(difficultyFilter.indexOf(option.value), 1)
                      }
                      else{
                          difficultyFilter.push(option.value);
                      }
                      this.setState({...this.state, filter: {...this.state.filter, difficulty: difficultyFilter}});
                  }
                  } key={key} {...option} />)}
              </Dropdown.Menu>
              <Dropdown.Header content='Primary Tags' />
              <Dropdown.Menu scrolling>
                {tags.PRIMARY.map((tag, key) => <Dropdown.Item key={key} text={toTitleCase(tag)} value={toTitleCase(tag)} label={{color: PRIMARY_COLOUR, empty: true, circular: true}} onClick={() => {
                    var filter = this.state.filter.tags.primary;
                    if(filter.indexOf(tag) != -1){
                        filter.splice(filter.indexOf(tag), 1)
                    }
                    else{
                        filter.push(tag);
                    }
                    this.setState({...this.state, filter: {...this.state.filter, tags: {...this.state.filter.tags, primary: filter}}});
                }
                } active={this.state.filter.tags.primary.indexOf(tag) == -1} />)}
              </Dropdown.Menu>
              <Dropdown.Header content='Secondary Tags' />
              <Dropdown.Menu scrolling>
                  {tags.SECONDARY.map((tag, key) => <Dropdown.Item key={key} text={toTitleCase(tag)} value={toTitleCase(tag)} label={{color: SECONDARY_COLOUR, empty: true, circular: true}} onClick={() => {
                      var filter = this.state.filter.tags.secondary;
                      if(filter.indexOf(tag) != -1){
                          filter.splice(filter.indexOf(tag), 1)
                      }
                      else{
                          filter.push(tag);
                      }
                      this.setState({...this.state, filter: {...this.state.filter, tags: {...this.state.filter.tags, secondary: filter}}});
                  }
                  } active={this.state.filter.tags.secondary.indexOf(tag) == -1}/>)}
              </Dropdown.Menu>
              <Dropdown.Header content='Tertiary Tags' />
              <Dropdown.Menu scrolling>
                  {tags.TERTIARY.map((tag, key) => <Dropdown.Item key={key} text={toTitleCase(tag)} value={toTitleCase(tag)} label={{color: TERTIARY_COLOUR, empty: true, circular: true}} onClick={() => {
                      var filter = this.state.filter.tags.tertiary;
                      if(filter.indexOf(tag) != -1){
                          filter.splice(filter.indexOf(tag), 1)
                      }
                      else{
                          filter.push(tag);
                      }
                      this.setState({...this.state, filter: {...this.state.filter, tags: {...this.state.filter.tags, tertiary: filter}}});
                  }
                  } active={this.state.filter.tags.tertiary.indexOf(tag) == -1} />)}
              </Dropdown.Menu>
            </Dropdown.Menu>
          </Dropdown>

        <Divider />
        <Card.Group itemsPerRow={4}>
        {this.props.data.questions.map((question, key) => {
          var questionText = convertToTex(question.text);
          var methodText = question.method ? convertToTex(question.method) : null;
          var answerText = question.answer ? convertToTex(question.answer) : null;
          var metadataText = (<span style={{textAlign: "center"}}>{question.metadata}</span>);
            var link = "/questions/" + question._id;
            var newTags = question.tags.length ? {
                primary: _.map(question.tags.filter((tag) => tag.type === 'PRIMARY'), 'text').map(text => toTitleCase(text)),
                secondary: _.map(question.tags.filter((tag) => tag.type === 'SECONDARY'), 'text').map((text => toTitleCase(text))),
                tertiary: _.map(question.tags.filter((tag) => tag.type === 'TERTIARY'), 'text').map(text => toTitleCase(text))
            } : question.tags;
            var display = this.state.filter.difficulty.indexOf(question.difficulty) == -1 && question.tags.length == 0 || (newTags.primary.map((text) => this.state.filter.tags.primary.indexOf(text) == -1).indexOf(true) != -1 && newTags.secondary.map((text) => this.state.filter.tags.secondary.indexOf(text) == -1).indexOf(true) != -1 && newTags.tertiary.map((text) => this.state.filter.tags.tertiary.indexOf(text) == -1).indexOf(true) != -1);
          return (<QuestionCard key={key} hide={!display} basic edit question={question} index={(key + 1)} deleteQuestion={() => this.props.deleteQuestion({variables: {id: question._id}})}/>)
        })}
      </Card.Group>
      </Container>
    );
  }
}

const deleteQuestion = gql`
  mutation deleteQuestion($id: ID!){
    deleteQuestion(questionID: $id)
  }
`

const questions = gql`
  query Questions{
    questions{
      _id
      text
      answer
      method
      metadata
      tags {
        type
        text
      }
        difficulty
      marks
    }
      tags
  }
`;

export default compose(graphql(deleteQuestion, {name: "deleteQuestion", options: {
  refetchQueries: ["Questions"]
}}),graphql(questions))(QuestionsPage);
