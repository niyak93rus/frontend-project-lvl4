const resources = {
  translation: {
    addChannel: 'Добавить канал',
    backToMain: "Вернуться на главную",
    channels: "Каналы",
    channelAdded: 'Канал создан',
    channelRenamed: 'Канал переименован',
    channelRemoved: 'Канал удалён',
    mainPage: "Главная",
    message: {
      placeholder: "Введите сообщение",
      button: "Отправить",
    },
    logIn: "Войти",
    loginLabel: "Логин",
    loginPlaceholder: "Ваш ник",
    logOut: "Выйти",
    errors: {
      username: {
        length: "От 3 до 20 символов",
        required: 'Логин обязателен!'
      },
      password: {
        length: "Не менее 6 символов",
        required: 'Пароль обязателен!'
      },
      passwordConfirmation: {
        oneOf: 'Пароли должны совпадать',
        required: 'Введите подтверждение пароля!',
      },
      other: {
        authFailed: "Неверные имя пользователя или пароль",
        axiosError: 'Ошибка соединения',
        existingChannel: 'Такой канал уже добавлен!',
        existingUsername: "Пользователь с таким именем уже существует!",
        messageNotDelivered: "Сообщение не доставлено",
        notRemovable: 'Канал нельзя удалить',
        requiredChannelname: 'Укажите название канала!',
        unnknownError: 'Что-то пошло не так',
      },
    },
    pageNotFound: "404 - Страница не найдена!",
    passwordConfirmationLabel: 'Подтверждение пароля',
    passwordConfirmationPlaceholder: "Подтвердите пароль",
    passwordLabel: "Пароль",
    passwordPlaceholder: 'Пароль',
    prompt: 'Вы уверены?',
    promptSignUp: 'Нет аккаунта?',
    registration: "Регистрация",
    rename: "Переименовать",
    remove: "Удалить",
    signUp: "Зарегистрироваться",
  }
}

export default resources;