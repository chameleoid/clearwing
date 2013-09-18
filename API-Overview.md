- [x] Clearwing
  - [x] networks[] -> Network
  - [x] network(network) -> Network
  - [x] hasNetwork(network)

  - [x] use(function(client) { })

  - [x] set(prop, value)
  - [x] get(prop)
    - [x] nick
    - [ ] ident
    - [ ] realname

  - [x] emit(ev, data)
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
    - [x] chanel(channel) -> Channel
    - [x] hasChannel(channel)

    - [x] users[] -> User
    - [x] user(user) -> User
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
      - [x] pass
      - [x] ssl

    - [ ] send(command, ...params)
    - [x] raw(message)

    - [x] connect()
    - [ ] disconnect()
    - [ ] reconnect()

    - [x] emit(ev, data)
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
    - [x] user(user) -> User
    - [x] hasUser(user)

    - [x] set(prop, value)
      - [ ] topic
    - [x] get(prop)
      - [x] joined
      - [x] topic
      - [x] mode

    - [x] join()
    - [ ] part()
    - [ ] message()
    - [ ] notice()
    - [ ] ctcp()
    - [ ] kick(user)
    - [ ] mode(user)

    - [x] emit(ev, data)
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
    - [x] channel(channel) -> Channel
    - [x] hasChannel(channel)

    - [x] set(prop, value)
    - [x] get(prop)
      - [ ] name
      - [ ] mode

    - [ ] message()
    - [ ] notice()
    - [ ] ctcp()
    - [ ] ping()

    - [x] emit(ev, data)
    - [x] on(ev, fn)
      - [ ] ctcp
      - [ ] message
      - [ ] notice
      - [ ] quit
      - [ ] raw
