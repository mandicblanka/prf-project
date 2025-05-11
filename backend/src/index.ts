import express from 'express';
import { configureRoutes } from './routes/routes';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import passport from 'passport';
import { configurePassport } from './passport/passport';
import mongoose from 'mongoose';
import { User } from './model/User';
import cors from 'cors';

const app = express();
const port = 3000;
const dbUrl = 'mongodb://localhost:5000/my_db'

mongoose.connect(dbUrl).then(_ => {
    console.log('Successfully connected to MongoDB.');
}).catch(error => {
    console.log(error);
});


const whiteList = ['*', 'http://localhost:4200']
const corsOptions = {
    origin: (origin: string | undefined, callback: (error: Error | null, allowed?: boolean) => void) => {
        if (whiteList.indexOf(origin!) !== -1 || whiteList.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS.'));
        }
    },
    credentials: true
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

const sessionOpitons: expressSession.SessionOptions = {
    secret: 'testsecret',
    resave: false,
    saveUninitialized: false,
}
app.use(expressSession(sessionOpitons));

app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

app.use('/app', configureRoutes(passport, express.Router()));

app.listen(port, () => {
    console.log(`The app is running on port ${port}`);
    checkAdminIsExists();
});

async function checkAdminIsExists() {
    const isAdminExists = await User.findOne({email: "adminGirl@admin.com"});
    if (!isAdminExists) {
        const adminUser = new User({email: "adminGirl@admin.com", password: "adminGirl", isAdmin: true});
        adminUser.save().then((_: any) => {
            console.log('Admin successfully created.');
        }).catch((error: any) => {
            console.error(error);
        })
    }
}