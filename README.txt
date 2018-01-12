About: веб-сервис построения отчетов.

Install:

1. База данных:
  - скачать и установить https://www.mongodb.com/dr/fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-3.6.2-signed.msi/download
  - проверить наличие папки C:\data\db после установки. Если нет - создать
  - должен быть постоянно запущено процесс C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe

2. Компилятор:
  - скачать и установить https://nodejs.org/dist/v8.9.4/node-v8.9.4-x64.msi

3. Код:
  - https://github.com/Adegeminas/forUnik/archive/master.zip - скачать, распаковать

4. Запуск:
  - из командной строки (cmd) перейти в папку с распакованным архивом (cd C:\user и т.д.)
  - набрать node app для запуска, открыть браузер (я тестировал в опере, в ie точно не будет работать пока) http://127.0.0.1:3000
