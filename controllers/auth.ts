import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { Request, Response } from 'express';

import User from '../models/User';

interface RegisterRequestBody {
  fullName: string;
  email: string;
  password: string;
  avatarUrl: string;
}

export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
  try {
    const { fullName, email, password, avatarUrl } = req.body;

    const isUsed = await User.findOne({ email });

    if (isUsed) {
      return res.status(409).json({
        message: 'Данный email уже занят.',
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hash,
      avatarUrl,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      'QrewRf123DA12R34QWEf514124rWRfew123514',
      {
        expiresIn: '30d',
      }
    );

    await newUser.save();

    res.json({
      newUser,
      token,
      message: 'Успешно зарегистрирован',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

interface LoginRequestBody {
  email: string;
  password: string;
}

export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
  try {
    const { email, password } = req.body;
    // console.log("🚀 ~ file: auth.ts:70 ~ login ~ email:", email)
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'Такого пользователя не существует'
      })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.json({
        message: 'Неверный пароль'
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      'QrewRf123DA12R34QWEf514124rWRfew123514',
      {
        expiresIn: '30d',
      }
    );
    res.status(200).json({
      token,
      user,
      message: 'Вы успешно авторизовались'
    })

  } catch (err) {
    res.json({
      message: 'Ошибка при авторизации'
    })
  }
}

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Данный пользователь не существует'
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    )

    res.json({
      user,
      token
    })

  } catch (err) {
    res.status(500).json({
      message: 'Нет доступа.'
    })
  }
}