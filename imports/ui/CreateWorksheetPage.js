import React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { Dimmer, Loader, Container } from "semantic-ui-react";

class CreateWorksheetPage extends React.Component{
    render(){
        if(this.props.data.loading) return (<Dimmer active><Loader /></Dimmer>);
        return (
            <Container>
             <ChooseTagSegment />
            </Container>
        );
    }
}


class ChooseTagSegment extends React.Component{
    render(){

    }
}

const worksheetQuery = gql`
    query Worksheet($tags: String, $count: Int){
        questionsByTag(tags: $tags, count: $count){
            _id
            text
            answer
        }
        tags
    }
`;
export default graphql(worksheetQuery)(CreateWorksheetPage);