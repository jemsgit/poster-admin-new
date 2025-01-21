#!/usr/bin/expect -f

stty -echo
send_user "Enter the password: " 
expect_user -re "(.*)\n"
stty echo
set pass $expect_out(1,string)

spawn rsync -au --progress dist/ -e "ssh -i ~/.ssh/key -o StrictHostKeyChecking=no" username@ip.address:/var/www/poster-admin/adminka
expect "passphrase"
send "$pass\r"
expect eof
sleep 5
interact