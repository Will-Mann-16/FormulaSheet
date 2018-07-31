import React from "react";
import { graphql, compose } from 'react-apollo';
import { Form, Dropdown, Dimmer, Loader, Card, Container, Header, TextArea, Button, Label, Icon, Input } from 'semantic-ui-react';
import gql from "graphql-tag";
import _ from "lodash"
import { getColourFromDifficulty, toTitleCase, convertToTex, PRIMARY_COLOUR, TERTIARY_COLOUR, SECONDARY_COLOUR, HARD_COLOUR, EXTENSION_COLOUR, MEDIUM_COLOUR, EASY_COLOUR, DIFFICULTY_DROPDOWN } from './texFunctions';
import QuestionCard from "./QuestionCard";
class EditQuestionPage extends React.Component{
    state = {
        text: '',
        method: '',
        answer: '',
        metadata: '',
        tags: {
            primary: [],
            primary: [],
            secondary: [],
            tertiary: []
        },
        options:{
            primary: [],
            secondary: [],
            tertiary: []
        },
        marks: 0,
        difficulty: ''
    }
    handlePrimaryAddition = (e, { value }) => {
        this.setState({
            ...this.state,
            options: {...this.state.options, primary: [{ text: value, value }, ...this.state.options.primary]}
        });
    }
    handleSecondaryAddition = (e, { value }) => {
        this.setState({
            ...this.state,
            options: {...this.state.options, secondary: [{ text: value, value }, ...this.state.options.secondary]}
        });
    }
    handleTertiaryAddition = (e, { value }) => {
        this.setState({
            ...this.state,
            options: {...this.state.options, tertiary: [{ text: value, value }, ...this.state.options.tertiary]}
        });
    }
    submitForm = e => {
        e.preventDefault();
        if(e.key !== 'Enter'){
            var tags = {primary: this.state.tags.primary.map(str => toTitleCase(str)), secondary: this.state.tags.secondary.map(str => toTitleCase(str)), tertiary: this.state.tags.tertiary.map(str => toTitleCase(str))};

            this.props.updateQuestion({
                variables:{
                    id: this.props.match.params.id,
                    text: this.state.text,
                    answer: this.state.answer === "" ? null : this.state.answer,
                    metadata: this.state.metadata === "" ? null : this.state.metadata,
                    method: this.state.method === "" ? null : this.state.method,
                    tags: tags === {primary: [], secondary: [], tertiary: []} ? null : JSON.stringify(tags),
                    marks: this.state.marks > 0 ? this.state.marks: null,
                    difficulty: this.state.difficulty === '' ? null: this.state.difficulty

                }
            }).then(() => this.props.history.goBack());
        }
    }
    handleAddition = (e, { value }) => {
        this.setState({
            options: [{ text: value, value }, ...this.state.options],
        })
    }
    componentWillReceiveProps(newProps){
        if(!newProps.data.loading) {
            var options = this.state.options;
            var tags = newProps.data.tags ? JSON.parse(newProps.data.tags) : null;
            options = newProps.data.tags ? {
                primary: _.uniq(_.flattenDeep(tags.PRIMARY.map((tag, key) => {return {text: toTitleCase(tag), value: toTitleCase(tag)}}), options.primary)),
                secondary: _.uniq(_.flattenDeep(tags.SECONDARY.map((tag, key) => {return {text: toTitleCase(tag), value: toTitleCase(tag)}}), options.secondary)),
                tertiary: _.uniq(_.flattenDeep(tags.TERTIARY.map((tag, key) => {return {text: toTitleCase(tag), value: toTitleCase(tag)}}), options.tertiary))
            } : this.state.options;
            var newTags = newProps.data.question.tags ? {
                primary: _.map(newProps.data.question.tags.filter((tag) => tag.type === 'PRIMARY'), 'text').map(text => toTitleCase(text)),
                secondary: _.map(newProps.data.question.tags.filter((tag) => tag.type === 'SECONDARY'), 'text').map((text => toTitleCase(text))),
                tertiary: _.map(newProps.data.question.tags.filter((tag) => tag.type === 'TERTIARY'), 'text').map(text => toTitleCase(text))
            } : this.state.tags;
            this.setState({...this.state, options}, () => this.setState({
                ...this.state,
                text: newProps.data.question.text ? newProps.data.question.text : this.state.text,
                answer: newProps.data.question.answer ? newProps.data.question.answer : this.state.answer,
                method: newProps.data.question.method ? newProps.data.question.method : this.state.method,
                metadata: newProps.data.question.metadata ? newProps.data.question.metadata : this.state.metadata,
                marks: newProps.data.question.marks ? newProps.data.question.marks : this.state.marks,
                tags: newTags,
                difficulty: newProps.data.question.difficulty ? newProps.data.question.difficulty : this.state.difficulty
            }));
        }
    }
    handlePrimaryChange = (e, { value }) => this.setState({...this.state, tags: {...this.state.tags, primary: value} })
    handleSecondaryChange = (e, { value }) => this.setState({...this.state, tags: {...this.state.tags, secondary: value} })
    handleTertiaryChange = (e, { value }) => this.setState({...this.state, tags: {...this.state.tags, tertiary: value} })

    render(){
        var questionText = convertToTex(this.state.text);
        var methodText = convertToTex(this.state.method);
        var answerText = convertToTex(this.state.answer);
        var metadataText = (<p style={{color: "grey", textAlign: "center"}}>{this.state.metadata}</p>);
        var tags = (<React.Fragment>
            {this.state.tags.primary.length > 0 ? this.state.tags.primary.map((tag, key2) => <Label key={key2}>{tag}</Label> ) : null}
            {this.state.tags.secondary.length > 0 ? this.state.tags.secondary.map((tag, key2) => <Label key={key2}>{tag}</Label> ) : null}
            {this.state.tags.tertiary.length > 0 ? this.state.tags.tertiary.map((tag, key2) => <Label key={key2}>{tag}</Label> ) : null}
        </React.Fragment>);
        if(this.props.data.loading) return (<Dimmer active>
            <Loader />
        </Dimmer>);
        return (
            <Container>
                <Form>
                    <Form.Field control={TextArea} autoHeight label="Question" value={this.state.text} onChange={(e) => this.setState({...this.state, text: e.target.value})} />
                    <Form.Field control={TextArea} autoHeight label="Method" value={this.state.method} onChange={(e) => this.setState({...this.state, method: e.target.value})}/>
                    <Form.Field control={TextArea} autoHeight label="Answer" value={this.state.answer} onChange={(e) => this.setState({...this.state, answer: e.target.value})}/>
                    <Form.Field control={TextArea} autoHeight label="Description" value={this.state.metadata} onChange={(e) => this.setState({...this.state, metadata: e.target.value})}/>
                    <Form.Field><label>Primary Tags</label><Dropdown placeholder='E.g. Maths, Further Maths, Physics, FP1, S2, M3, C4, etc.' fluid allowAdditions multiple search selection options={this.state.options.primary} value={this.state.tags.primary} onChange={this.handlePrimaryChange} onAddItem={this.handlePrimaryAddition} renderLabel={({text}, index, defaultLabelProps) => <Label color={PRIMARY_COLOUR} key={text} {...defaultLabelProps}>{text}</Label>}/></Form.Field>
                    <Form.Field><label>Secondary Tags</label><Dropdown placeholder='E.g. Calculus, Integration, Algebra, Particle Physics, etc.' fluid allowAdditions multiple search selection options={this.state.options.secondary} value={this.state.tags.secondary} onChange={this.handleSecondaryChange} onAddItem={this.handleSecondaryAddition} renderLabel={({text}, index, defaultLabelProps) => <Label color={SECONDARY_COLOUR} key={text} {...defaultLabelProps}>{text}</Label>}/></Form.Field>
                    <Form.Field><label>Tertiary Tags</label><Dropdown placeholder='E.g. Integration by Parts, Completing the Square, Energy Level Diagrams' fluid allowAdditions multiple search selection options={this.state.options.tertiary} value={this.state.tags.tertiary} onChange={this.handleTertiaryChange} onAddItem={this.handleTertiaryAddition} renderLabel={({text}, index, defaultLabelProps) => <Label color={TERTIARY_COLOUR} key={text} {...defaultLabelProps}>{text}</Label>}/></Form.Field>
                    <Form.Field><label>Marks</label><Input fluid type="number" value={this.state.marks} onChange={(e) => this.setState({...this.state, marks: parseInt(e.target.value)})} max={100} min={0}/></Form.Field>
                    <Form.Field><label>Difficulty</label><Dropdown fluid selection options={DIFFICULTY_DROPDOWN} placeholder='Difficulty Rating' onChange={(e, {value}) => this.setState({difficulty: value})} value={this.state.difficulty}/></Form.Field>
                    <Button onClick={this.submitForm}>Submit</Button>
                </Form>
                <QuestionCard question={this.state} />
            </Container>
        );
    }
}

const questionAndTags = gql`
    query Question($id: ID!){
        question(questionID: $id){
            _id
            text
            method
            metadata
            answer
            tags{
                text
                type
            }
            marks
            difficulty
        }
        tags
    }
`

const updateQuestion = gql`
    mutation updateQuestion($id: ID!, $text: String!, $answer: String, $metadata: String, $method: String, $tags: String, $marks: Int, $difficulty: String){
        updateQuestion(questionID: $id, text: $text, answer: $answer, metadata: $metadata, method: $method, tags: $tags, marks: $marks, difficulty: $difficulty){
            _id
        }
    }
`;

export default compose(graphql(updateQuestion, {name: "updateQuestion", options: {
        refetchQueries: ["Questions"]
    }}), graphql(questionAndTags, {options: (ownProps) => ({
        variables: {
            id: ownProps.match.params.id
        }
    })}))(EditQuestionPage);
