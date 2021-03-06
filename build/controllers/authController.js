"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const authDAO_1 = require("../dao/authDAO");
const utils_1 = require("../utils/utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtKey_1 = __importDefault(require("../config/jwtKey"));
class AuthController {
    // Nombre: Login
    // Descripción En este metodo se comprueban 
    // los datos de acceso del usuario
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            //Validar campos vacios
            if (username == null || password == null)
                return res.status(400).json({ message: "Los datos no pueden ser nulos" });
            const users = yield authDAO_1.dao.getUser(username);
            // Validar si ya existe el usuario
            if (users.length <= 0)
                return res.status(400).json({ message: "El usuario no existe" });
            // Validar que la contraseña sea correcta
            for (let user of users) {
                if (yield utils_1.utils.checkPassword(password, user.password)) {
                    const token = jsonwebtoken_1.default.sign({ cveUsuario: user.cveUsuario, username }, jwtKey_1.default.jwtSecret, { expiresIn: '1h' });
                    return res.json({ message: "OK", token, cveUsuario: user.cveUsuario, username });
                    //console.log(token);
                    //return res.json({message: "Funciona pariente"});
                }
                else {
                    return res.status(400).json({ message: "La constraseña es incorrecta" });
                }
            }
        });
    }
}
exports.authController = new AuthController();
