import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import auth from './src/routes/auth';
import user from './src/routes/user';
import create from './src/routes/create';
import receiving from './src/routes/receiving';
import shipping from './src/routes/shipping';
import find from './src/routes/find';
import edit from './src/routes/edit';
import 'dotenv/config';
const port = process.env.PORT || 8080;
const app = express();
app.use(cors({ origin: process.env.CLI_BASEURL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

//認証用api
app.use('/api/auth', auth);
//データ作成用api
app.use('/api/create', create);
//ユーザーapi
app.use('/api/user', user);
//入荷api
app.use('/api/receiving', receiving);
//出荷api
app.use('/api/shipping', shipping);

app.use('/api/find', find);

app.use('/api/edit', edit);

app.listen(port, () => console.log(`http://localhost:${port}`));
