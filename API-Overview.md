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
    - [x] message -> user/channel.message
    - [x] notice -> user/channel.notice
    - [x] join -> channel.join
    - [x] part -> channel.part
    - [ ] quit -> user.quit
    - [x] connect -> network.connect
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
      - [x] message -> user/channel.message
      - [x] notice -> user/channel.notice
      - [x] join -> channel.join
      - [x] part -> channel.part
      - [ ] quit -> user.quit
      - [x] connect
      - [x] ping
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
      - [x] autojoin

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
      - [ ] topic
      - [x] message
      - [x] notice
      - [x] join
      - [x] part
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
      - [ ] nick
      - [ ] ident
      - [ ] host
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
      - [x] message
      - [x] notice
      - [x] quit
      - [ ] raw
