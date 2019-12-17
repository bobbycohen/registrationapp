"use strict";

const crypto = require("crypto");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const makeSalt = () => Math.round(new Date().valueOf() * Math.random()) + "";

const encryptPassword = (salt, password) =>
    crypto
        .createHmac("sha512", salt)
        .update(password)
        .digest("hex");

//const reservedNames = ["password"];

let userSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    city: { type: String, required: false },
    primary_email: { type: String, required: true },
    hash: { type: String, required: true },
    salt: { type: String, required: false },
    games: { type: Array }
});

userSchema.virtual("password").set(function(password) {
    this.salt = makeSalt();
    this.hash = encryptPassword(this.salt, password);
});

userSchema.method("authenticate", function(plainText) {
    return encryptPassword(this.salt, plainText) === this.hash;
});

userSchema.pre("save", function(next) {
    this.username = this.username.toLowerCase();
    this.primary_email = this.primary_email.toLowerCase();
    this.first_name = this.first_name.replace(/<(?:.|\n)*?>/gm, "");
    this.last_name = this.last_name.replace(/<(?:.|\n)*?>/gm, "");
    this.city = this.city.replace(/<(?:.|\n)*?>/gm, "");
    next();
});

module.exports = mongoose.model('User', userSchema);