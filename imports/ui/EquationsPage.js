import React from "react";
import { graphql, compose } from 'react-apollo';
import { Toggle } from "react-powerplug";
import { Form, Dimmer, Loader, Modal, Container, TextArea, Button, List, Confirm, Dropdown } from 'semantic-ui-react';
import {convertToTex, TERTIARY_COLOUR, PRIMARY_COLOUR, SECONDARY_COLOUR, toTitleCase} from "./texFunctions";
import _ from "lodash"
import gql from "graphql-tag";

const initialState = {
  title: '',
  tex: '',
  open: false,
    tags: {
        primary: [],
        secondary: [],
        tertiary: []
    },
    options: {
    primary: [],
        secondary: [],
        tertiary: []
    },
  edit: false,
  _id: ''
}
class EquationsPage extends React.Component{
  state = {
    title: '',
    tex: '',
    open: false,
    edit: false,
      tags: {
          primary: [],
          secondary: [],
          tertiary: []
      },
      options:{
          primary: [],
          secondary: [],
          tertiary: []
      },
    _id: ''
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
  submitForm = (e) => {
    e.preventDefault();
      var tags = {primary: this.state.tags.primary.map(str => toTitleCase(str)), secondary: this.state.tags.secondary.map(str => toTitleCase(str)), tertiary: this.state.tags.tertiary.map(str => toTitleCase(str))};
      if(this.state.edit){
      this.props.updateEquation({
        variables:{
          id: this.state._id,
          title: this.state.title,
          tex: this.state.tex,
            tags: tags === {primary: [], secondary: [], tertiary: []} ? null : JSON.stringify(tags),
        }
      }).then(() => this.setState({...initialState}));
    }
    else{
    this.props.createEquation({
      variables: {
        title: this.state.title,
        tex: this.state.tex
      }
    }).then(() => this.setState({...initialState}));
  }
  }
    componentWillReceiveProps(newProps){
        if(!newProps.data.loading){
            var options = this.state.options;
            var tags = newProps.data.tags ? JSON.parse(newProps.data.tags) : this.state.options;
            options = newProps.data.tags ? {
                primary: _.uniq(_.flattenDeep(tags.PRIMARY.map((tag, key) => {return {text: toTitleCase(tag), value: toTitleCase(tag)}}), options)),
                secondary: _.uniq(_.flattenDeep(tags.SECONDARY.map((tag, key) => {return {text: toTitleCase(tag), value: toTitleCase(tag)}}), options)),
                tertiary: _.uniq(_.flattenDeep(tags.TERTIARY.map((tag, key) => {return {text: toTitleCase(tag), value: toTitleCase(tag)}}), options))
            } : this.state.options;
            this.setState({...this.state, options});
        }
    }
    handlePrimaryChange = (e, { value }) => this.setState({...this.state, tags: {...this.state.tags, primary: value} })
    handleSecondaryChange = (e, { value }) => this.setState({...this.state, tags: {...this.state.tags, secondary: value} })
    handleTertiaryChange = (e, { value }) => this.setState({...this.state, tags: {...this.state.tags, tertiary: value} })

    render(){
    if(this.props.data.loading) return (<Dimmer active>
      <Loader />
    </Dimmer>);
        var tags = (<React.Fragment>
            {this.state.tags.primary.length > 0 ? this.state.tags.primary.map((tag, key2) => <Label color={PRIMARY_COLOUR} key={key2}>{tag}</Label> ) : null}
            {this.state.tags.secondary.length > 0 ? this.state.tags.secondary.map((tag, key2) => <Label color={SECONDARY_COLOUR} key={key2}>{tag}</Label> ) : null}
            {this.state.tags.tertiary.length > 0 ? this.state.tags.tertiary.map((tag, key2) => <Label color={TERTIARY_COLOUR} key={key2}>{tag}</Label> ) : null}
        </React.Fragment>);
    return (
      <Container>
        <Modal open={this.state.open} onClose={() => this.setState({...this.state, open: false})} trigger={<Button onClick={() => this.setState({...this.state, open: true, edit: false, _id: ''})}>Add</Button>}>
          <Modal.Header>Add Equation</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input label='Title' type="text" value={this.state.title} onChange={(e) => this.setState({...this.state, title: e.target.value})} />
              <Form.Field control={TextArea} autoHeight label="Equation" value={this.state.tex} onChange={(e) => this.setState({...this.state, tex: e.target.value})} />
              <Form.Field><label>Primary Tags</label><Dropdown placeholder='E.g. Maths, Further Maths, Physics, FP1, S2, M3, C4, etc.' fluid allowAdditions multiple search selection options={this.state.options.primary} value={this.state.tags.primary} onChange={this.handlePrimaryChange} onAddItem={this.handlePrimaryAddition} renderLabel={({text}, index, defaultLabelProps) => <Label color={PRIMARY_COLOUR} key={text} {...defaultLabelProps}>{text}</Label>}/></Form.Field>
              <Form.Field><label>Secondary Tags</label><Dropdown placeholder='E.g. Calculus, Integration, Algebra, Particle Physics, etc.' fluid allowAdditions multiple search selection options={this.state.options.secondary} value={this.state.tags.secondary} onChange={this.handleSecondaryChange} onAddItem={this.handleSecondaryAddition} renderLabel={({text}, index, defaultLabelProps) => <Label color={SECONDARY_COLOUR} key={text} {...defaultLabelProps}>{text}</Label>}/></Form.Field>
              <Form.Field><label>Tertiary Tags</label><Dropdown placeholder='E.g. Integration by Parts, Completing the Square, Energy Level Diagrams' fluid allowAdditions multiple search selection options={this.state.options.tertiary} value={this.state.tags.tertiary} onChange={this.handleTertiaryChange} onAddItem={this.handleTertiaryAddition} renderLabel={({text}, index, defaultLabelProps) => <Label color={TERTIARY_COLOUR} key={text} {...defaultLabelProps}>{text}</Label>}/></Form.Field>
            </Form>
              {this.state.tex ? convertToTex(this.state.tex) : null}
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => this.setState({...this.state, open: false})} color='red'>Cancel</Button>
            <Button onClick={this.submitForm} color='green'>Submit</Button>
          </Modal.Actions>
        </Modal>
        <List>
        {this.props.data.equations ? this.props.data.equations.map((equation, key) => {
          var equationText = convertToTex(equation.tex);
          return (
            <Toggle>
              {({on, toggle}) => (
                <React.Fragment>
            <List.Item>
              <List.Header>{equation.title}</List.Header>
              {equationText}
              <Button icon='edit' onClick={() => this.setState({...this.state,tex: equation.tex, title: equation.title,  _id: equation._id, open: true, edit: true})}/>
              <Button icon='trash' onClick={toggle} />
            </List.Item>
            <Confirm open={on} onCancel={toggle} onConfirm={() => this.props.deleteEquation({variables: {id: equation._id}}).then(() => toggle())} />
          </React.Fragment>
          )}
        </Toggle>
        )}) : null}
      </List>
      </Container>
    )
  }
}

const createEquation = gql`
  mutation createEquation($tex: String!, $title: String!, $tags: String){
    createEquation(tex: $tex, title: $title, tags: $tags){
      _id
    }
  }
`
const updateEquation = gql`
mutation updateEquation($id: ID!, $tex: String!, $title: String!, $tags: String){
  updateEquation(equationID: $id, tex: $tex, title: $title, tags: $tags){
    _id
  }
}
`
const deleteEquation = gql`
  mutation deleteEquation($id: ID!){
    deleteEquation(equationID: $id)
  }
`;
const equations = gql`
  query Equations{
    equations{
      _id
      tex
      title
    }
      tags
  }
`;
export default compose(graphql(equations), graphql(createEquation, { name: "createEquation", options: {
  refetchQueries: ["Equations"]
}}), graphql(updateEquation, { name: "updateEquation", options: {
  refetchQueries: ["Equations"]
}}),graphql(deleteEquation, { name: "deleteEquation", options: {
  refetchQueries: ["Equations"]
}}))(EquationsPage);
