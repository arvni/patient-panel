// const getObject = (stringPart: string, prevValues: object): object => {
//     let output=prevValues;
//     let [queryPart,...rest]=stringPart.split("=");
//     let result=rest.join("=");
//     let subObjects=queryPart.split("]").join("").split("[");
//
//     for (let subObject of subObjects ){
//         if (!output.hasOwnProperty(subObject))
//     }
//     return output;
// }
//

// const getObject = (stringPart: string, prevValues: object): object => {
//     const output = {...prevValues}; // Create a shallow copy of prevValues
//
//     const [queryPart, ...rest] = stringPart.split("=");
//     const propertyValue = rest.join("=");
//
//     const nestedProperties = queryPart.split("]").join("").split("[");
//     const lastPart = nestedProperties.pop();
//     let currentObject = output;
//     for (let i = 0; i < nestedProperties.length; i++) {
//         if (nestedProperties[i]) {
//             const property = nestedProperties[i];
//             if (!currentObject[property]) {
//                 currentObject[property] = {};
//             }
//             currentObject = currentObject[property];
//         }
//     }
//
//     currentObject[lastPart] = propertyValue;
//     return output;
// };
//
//
// export const q2p = (queryString: string): Record<any, any> => {
//     let startString = queryString.split("?").join("");
//     let parts: string[] = startString.split("?").join("").split("&");
//     let output = {};
//     for (let part of parts) {
//         output = getObject(part, output);
//     }
//     return output;
// }
