import Equations from "./equations";
import _  from "lodash"

export default {
  Query: {
    equations(obj, args, context){
      return Equations.find({}).fetch();
    }
  },
  Mutation: {
    createEquation(obj, {tex, title, tags}, context){
        tags = JSON.parse(tags);
        tags = _.flattenDeep([tags.primary.map((tag) => { return {text: tag, type: "PRIMARY"}}), tags.secondary.map((tag) => { return {text: tag, type: "SECONDARY"}}), tags.tertiary.map((tag) => {return {text: tag, type: "TERTIARY"}})]);
      var equationID = Equations.insert({tex, title, tags});
      return Equations.findOne(equationID);
    },
    updateEquation(obj, {equationID, tex, title, tags}, context){
        tags = JSON.parse(tags);
        tags = _.flattenDeep([tags.primary.map((tag) => { return {text: tag, type: "PRIMARY"}}), tags.secondary.map((tag) => { return {text: tag, type: "SECONDARY"}}), tags.tertiary.map((tag) => {return {text: tag, type: "TERTIARY"}})]);
      Equations.update(equationID, {$set: {tex, title, tags}});
      return Equations.findOne(equationID);
    },
    deleteEquation(obj, {equationID}, context){
      return Equations.remove(equationID);
    }
  }
}
