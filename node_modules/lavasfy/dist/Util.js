"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const v8_1 = require("v8");
class Util {
    static try(fn) {
        try {
            return fn();
        }
        catch {
            return undefined;
        }
    }
    static async tryPromise(fn) {
        try {
            return await fn();
        }
        catch {
            return undefined;
        }
    }
    static structuredClone(obj) {
        return v8_1.deserialize(v8_1.serialize(obj));
    }
    static mergeDefault(def, prov) {
        const merged = { ...def, ...prov };
        const defKeys = Object.keys(def);
        for (const mergedKey of Object.keys(merged)) {
            if (!defKeys.includes(mergedKey))
                delete merged[mergedKey];
        }
        return merged;
    }
}
exports.default = Util;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9VdGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkJBQTRDO0FBRTVDLE1BQXFCLElBQUk7SUFDZCxNQUFNLENBQUMsR0FBRyxDQUFJLEVBQVc7UUFDNUIsSUFBSTtZQUNBLE9BQU8sRUFBRSxFQUFFLENBQUM7U0FDZjtRQUFDLE1BQU07WUFDSixPQUFPLFNBQVMsQ0FBQztTQUNwQjtJQUNMLENBQUM7SUFFTSxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBSSxFQUFvQjtRQUNsRCxJQUFJO1lBQ0EsT0FBTyxNQUFNLEVBQUUsRUFBRSxDQUFDO1NBQ3JCO1FBQUMsTUFBTTtZQUNKLE9BQU8sU0FBUyxDQUFDO1NBQ3BCO0lBQ0wsQ0FBQztJQUVNLE1BQU0sQ0FBQyxlQUFlLENBQUksR0FBTTtRQUNuQyxPQUFPLGdCQUFXLENBQUMsY0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFNLENBQUM7SUFDNUMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxZQUFZLENBQUksR0FBTSxFQUFFLElBQU87UUFDekMsTUFBTSxNQUFNLEdBQUcsRUFBRSxHQUFHLEdBQUcsRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO1FBQ25DLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsS0FBSyxNQUFNLFNBQVMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztnQkFBRSxPQUFRLE1BQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN2RTtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7Q0FDSjtBQTdCRCx1QkE2QkMifQ==