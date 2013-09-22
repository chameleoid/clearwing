- [x] Clearwing
  - [x] networks[] -> Network
  - [x] network(network[, ctx]) -> Network
  - [x] hasNetwork(network)

  - [x] use(function(client) { })

  - [x] set(prop, value)
  - [x] get(prop)
    - [x] nick
    - [ ] ident
    - [ ] realname
    - [ ] reconnect

  - [x] emit(ev, data)
  - [ ] once(ev, fn)
  - [x] on(ev, fn)
    - [ ] ctcp -> user/channel.ctcp
    - [ ] message -> user/channel.message
    - [ ] notice -> user/channel.notice
    - [ ] join -> channel.join
    - [ ] part -> channel.part
    - [ ] quit -> user.quit
    - [ ] raw

  - [x] Network
    - [x] client -> Clearwing

    - [x] channels[] -> Channel
    - [x] chanel(channel[, ctx]) -> Channel
    - [x] hasChannel(channel)

    - [x] users[] -> User
    - [x] user(user[, ctx]) -> User
    - [x] hasUser(user)

    - [x] set(prop, value)
    - [x] get(prop)
      - [x] name
      - [x] connected
      - [x] status
      - [x] nick
      - [ ] ident
      - [ ] realname
      - [x] server
      - [x] port
      - [ ] password
      - [ ] ssl
      - [ ] autoconnect

    - [x] send([buffer, ]command, ...params)
    - [x] raw(message[, buffer])

    - [x] connect()
    - [x] disconnect()
    - [x] reconnect()

    - [x] emit(ev, data)
    - [ ] once(ev, fn)
    - [x] on(ev, fn)
      - [ ] ctcp -> user/channel.ctcp
      - [ ] message -> user/channel.message
      - [ ] notice -> user/channel.notice
      - [ ] join -> channel.join
      - [ ] part -> channel.part
      - [ ] quit -> user.quit
      - [ ] connect
      - [ ] ping
      - [x] raw

  - [x] Channel
    - [x] client -> Clearwing

    - [x] network -> Network

    - [x] users[] -> User
    - [x] user(user[, ctx]) -> User
    - [x] hasUser(user)

    - [x] set(prop, value)
      - [ ] topic
    - [x] get(prop)
      - [x] joined
      - [ ] topic
      - [ ] mode
      - [ ] autojoin

    - [x] join()
    - [x] part()
    - [x] message()
    - [x] action()
    - [x] notice()
    - [x] ctcp()
    - [x] kick(user(s), message)
    - [ ] mode(modes)

    - [x] emit(ev, data)
    - [ ] once(ev, fn)
    - [x] on(ev, fn)
      - [ ] ctcp
      - [ ] message
      - [ ] notice
      - [ ] join
      - [ ] part
      - [ ] quit -> user.quit
      - [ ] raw

  - [x] User
    - [x] client -> Clearwing

    - [x] network -> Network

    - [x] channels[] -> Channel
    - [x] channel(channel[, ctx]) -> Channel
    - [x] hasChannel(channel)

    - [x] set(prop, value)
    - [x] get(prop)
      - [ ] name
      - [ ] mode

    - [x] message()
    - [x] action()
    - [x] notice()
    - [x] ctcp()
    - [ ] ping(cb)

    - [x] emit(ev, data)
    - [ ] once(ev, fn)
    - [x] on(ev, fn)
      - [ ] ctcp
      - [ ] message
      - [ ] notice
      - [ ] quit
      - [ ] raw
