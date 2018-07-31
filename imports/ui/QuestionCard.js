import React from "react";
import { Card, Header, Confirm, Button, Label,  } from "semantic-ui-react";
import { getColourFromDifficulty, convertToTex, PRIMARY_COLOUR, SECONDARY_COLOUR, TERTIARY_COLOUR, toTitleCase} from "./texFunctions";
import {Toggle} from "react-powerplug";
import { Link } from "react-router-dom";
import _ from "lodash"
export default class QuestionCard extends React.Component{
    render(){
        var {question, basic, index, edit, deleteQuestion, hide} = this.props;
            var questionText = convertToTex(question.text);
            var methodText = convertToTex(question.method);
            var answerText = convertToTex(question.answer);
            var link = "/questions/" + question._id;
            var newTags = question.tags.length ? {
                primary: _.map(question.tags.filter((tag) => tag.type === 'PRIMARY'), 'text').map(text => toTitleCase(text)),
                secondary: _.map(question.tags.filter((tag) => tag.type === 'SECONDARY'), 'text').map((text => toTitleCase(text))),
                tertiary: _.map(question.tags.filter((tag) => tag.type === 'TERTIARY'), 'text').map(text => toTitleCase(text))
            } : question.tags;
        var tags = newTags.primary && newTags.secondary && newTags.tertiary ?(<React.Fragment>
            <Label.Group>{(newTags.primary && newTags.primary.length > 0) ? newTags.primary.map((tag, key2) => <Label color={PRIMARY_COLOUR} key={key2}>{tag}</Label> ) : null}</Label.Group>
            <Label.Group>{(newTags.secondary && newTags.secondary.length > 0) ? newTags.secondary.map((tag, key2) => <Label color={SECONDARY_COLOUR} key={key2}>{tag}</Label> ) : null}</Label.Group>
            <Label.Group>{(newTags.tertiary && newTags.tertiary.length > 0) ? newTags.tertiary.map((tag, key2) => <Label color={TERTIARY_COLOUR} key={key2}>{tag}</Label> ) : null}</Label.Group>
            </React.Fragment>): null;
            if (hide) return null;
            return basic ? (
                <Toggle>
                {({on, toggle}) =>(
                    <React.Fragment>
                        <Card color={getColourFromDifficulty(question.difficulty)}>
                            <Card.Content style={{ whiteSpace: 'pre-wrap' }}>
                                {question.marks ? <Label basic attached='top left'>{question.marks ? '[' + question.marks + ']' : null}</Label> : null}
                                {question.difficulty ? <Label color={getColourFromDifficulty(question.difficulty)} attached='top right'>{question.difficulty}</Label> : null}
                                {index ? <Card.Header textAlign='center'>Question {index}</Card.Header> : null}
                                <Card.Meta>{question.metadata}</Card.Meta>
                                {questionText}
                            </Card.Content>
                            <Card.Content textAlign='center'>
                                {tags}
                            </Card.Content>
                            {edit ? <Card.Content extra textAlign='center'>
                                <Button icon='edit' as={Link} to={link}/>
                                <Button icon='trash' onClick={toggle} />
                            </Card.Content> : null}
                        </Card>
                        <Confirm open={on} onCancel={toggle} onConfirm={() => { deleteQuestion(); toggle();} } />
                    </React.Fragment>
                )}
            </Toggle>) : (
                <Card fluid color={getColourFromDifficulty(question.difficulty)}>
                    <Card.Content style={{ whiteSpace: 'pre-wrap' }}>
                        {question.marks ? <Label basic attached='top left'>{question.marks ? '[' + question.marks + ']' : null}</Label> : null}
                        {question.difficulty ? <Label color={getColourFromDifficulty(question.difficulty)} attached='top right'>{question.difficulty}</Label> : null}
                        {index ? <Card.Header textAlign='center'>Question {index}</Card.Header> : null}
                        <Header as='h3'>Question</Header>
                        {questionText}
                        <Header as='h3'>Method</Header>
                        {methodText}
                        <Header as='h3'>Answer</Header>
                        {answerText}
                        <Card.Meta>{question.metadata}</Card.Meta>
                    </Card.Content>
                    <Card.Content>

                        {tags}
                    </Card.Content>
                </Card>
            );


    }
}