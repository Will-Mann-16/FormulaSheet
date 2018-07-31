import Questions from "./questions";
import Equations from "../equations/equations";
import _ from "lodash"
export default {
  Query:{
    questions(obj, args, context){
      return Questions.find({}).fetch();
    },
    tags(obj, args, context){
      return JSON.stringify({
          PRIMARY: _.uniq(_.flattenDeep(Questions.find({},{fields: {tags: 1}}).fetch().map((x) => x.tags ? x.tags.filter((x) => x.type === "PRIMARY").map((x) => x.text) : []), Equations.find({},{fields: {tags: 1}}).fetch().map((x) => x.tags ? x.tags.filter((x) => x.type === "PRIMARY").map((x) => x.text) : []))),
          SECONDARY: _.uniq(_.flattenDeep(Questions.find({},{fields: {tags: 1}}).fetch().map((x) => x.tags ? x.tags.filter((x) => x.type === "SECONDARY").map((x) => x.text) : []), Equations.find({},{fields: {tags: 1}}).fetch().map((x) => x.tags ? x.tags.filter((x) => x.type === "SECONDARY").map((x) => x.text): []))),
          TERTIARY: _.uniq(_.flattenDeep(Questions.find({},{fields: {tags: 1}}).fetch().map((x) => x.tags ? x.tags.filter((x) => x.type === "TERTIARY").map((x) => x.text) : []), Equations.find({},{fields: {tags: 1}}).fetch().map((x) => x.tags ? x.tags.filter((x) => x.type === "TERTIARY").map((x) => x.text) : []))),
        });
    },
    question(obj, {questionID}, context){
      return Questions.findOne({_id: questionID});
    },
    questionByTag(obj, {tags}, context){
      tags = JSON.parse(tags);
      tags = _.union(tags.primary.map((tag) => {return {text: tag, type: "PRIMARY"}}), tags.secondary.map((tag) => {return {text: tag, type: "SECONDARY"}}), tags.tertiary.map((tag) => {return {text: tag, type: "TERTIARY"}}));
      Questions.find({tags: {$in: tags}}, {limit: count}).fetch();
    }
  },
  Mutation:{
    createQuestion(obj, {text, answer, metadata, method, tags, marks, difficulty}, context){
      tags = JSON.parse(tags);
      tags = _.flattenDeep([tags.primary.map((tag) => { return {text: tag, type: "PRIMARY"}}), tags.secondary.map((tag) => { return {text: tag, type: "SECONDARY"}}), tags.tertiary.map((tag) => {return {text: tag, type: "TERTIARY"}})]);
      const questionID = Questions.insert({text, answer, metadata, method, tags, marks, difficulty});
      return Questions.findOne(questionID);
    },
    updateQuestion(obj, {questionID, text, answer, metadata, method, tags, marks, difficulty}, context){
      tags = JSON.parse(tags);
      tags = _.flattenDeep([tags.primary.map((tag) => {return {text: tag, type: "PRIMARY"}}), tags.secondary.map((tag) => {return {text: tag, type: "SECONDARY"}}), tags.tertiary.map((tag) => {return {text: tag, type: "TERTIARY"}})]);
      Questions.update(questionID, {$set: {text, answer, metadata, method, tags, marks, difficulty}});
      return Questions.findOne(questionID);
    },
    deleteQuestion(obj, {questionID}, context){
      return Questions.remove(questionID);
    }
  }
}
