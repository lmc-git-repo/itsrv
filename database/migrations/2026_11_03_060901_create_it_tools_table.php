
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('it_tools', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->nullable();
            $table->string('icon')->nullable();
            $table->text('url');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        $tools = [
            ['Inventory System', 'Systems', 'LMC-Logo-Wht.png', 'https://10.208.10.10:446/login'],
            ['IT Ticketing System', 'Systems', 'LMC-Logo-Wht.png', 'https://10.208.10.234:446/login'],
            ['LMC Website for Users', 'Systems', 'LMC-Logo-Wht.png', 'https://lmcweb.synology.me/'],
            ['LMC Website - Login', 'Systems', 'LMC-Logo-Wht.png', 'https://lmcweb.synology.me/login'],

            ['CCTV Viewing 1', 'CCTV', 'cctv.png', 'http://192.168.10.9'],
            ['CCTV Viewing 2', 'CCTV', 'cctv.png', 'http://192.168.10.10'],

            ['Firewall', 'Security', 'firewall.png', 'https://10.208.10.254/login?redir=%2F'],

            ['Synology File Server', 'Servers', 'nas.png', 'http://10.208.10.248:5000/#/signin'],
            ['Synology QC Server', 'Servers', 'nas.png', 'http://10.208.10.251:5000/#/signin'],
            ['Synology Server Backup', 'Servers', 'nas.png', 'https://10.208.10.10:5001/#/signin'],
            ['Synology New Server Backup 1', 'Servers', 'nas.png', 'https://10.208.10.233:5001/#/signin'],
            ['Synology New Server Backup 2', 'Servers', 'nas.png', 'https://10.208.10.234:5001/#/signin'],

            ['Admin Printer', 'Printers', 'printer.jpg', 'http://10.208.10.101/home/index.html#hashHome'],
            ['Production Printer', 'Printers', 'printer.jpg', 'http://10.208.10.102/home/index.html#hashHome'],
            ['Fujifilm Support Page', 'Printers', 'printer.jpg', 'https://www.fujifilm.com/fbph/en'],
            ['Printer Add-Ons Color Impressions', 'Printers', 'printer.jpg', 'https://docs.google.com/spreadsheets/d/15M9txVcQYHcPIyYX_BnT0-8wLi6tk5ehZL9Mk5_d14A/edit?gid=585269856#gid=585269856'],

            ['CCTV Room L2 Switch', 'Switches', 'ruijie.png', 'https://10.208.10.235/cgi-bin/luci/;stok=dc34d364c441f76cdf8fb9faa415bd9b/master'],
            ['Ruijie L3 Switch', 'Switches', 'ruijie3.png', 'https://10.208.10.244/app/login'],
            ['TP Link L2 Switch', 'Switches', 'tp-link.png', 'https://10.208.10.245/'],
            ['TP Link - B.Court', 'Switches', 'tp-link.png', 'https://10.208.10.247/'],

            ['Assy Prod Wifi', 'Access Points', 'ruijie.png', 'https://10.208.10.221/cgi-bin/luci/?stamp=1774858464'],
            ['QC/PPC Office Wifi', 'Access Points', 'ruijie2.jpg', 'https://10.208.20.240/index.htm'],
            ['Admin Office Wifi', 'Access Points', 'ruijie.png', 'https://10.208.10.220/cgi-bin/luci/?stamp=1780882467'],
            ['DC Office Wifi', 'Access Points', 'engenius.png', 'http://10.208.20.228/cgi-bin/luci'],
            ['DB Office Wifi', 'Access Points', 'engenius.png', 'http://10.208.20.225/cgi-bin/luci/;stok=e89aca4052223b5a60466aab9f6b38bb/html/index'],
            ['MC Prod Wifi', 'Access Points', 'ruijie.png', 'https://10.208.10.223/cgi-bin/luci/?stamp=1774854151'],
            ['DC Prod Wifi', 'Access Points', 'engenius.png', 'http://10.208.20.226/cgi-bin/luci'],
            ['Minobu RM Wifi', 'Access Points', 'ruijie2.jpg', 'https://10.208.10.230/'],
            ['HPI Prod Wifi', 'Access Points', 'ruijie.png', 'https://10.208.10.222/cgi-bin/luci/?stamp=1774854844'],
            ['DC Office Wifi 2', 'Access Points', 'ruijie.png', 'https://10.208.10.219/cgi-bin/luci/?stamp=1774854916'],

            ['LMC Website', 'Databases', 'phpmyadmin.png', 'https://10.208.10.233:8443/'],
            ['LMC IMS', 'Databases', 'phpmyadmin.png', 'https://10.208.10.10/phpmyadmin/'],
            ['LMC ITS', 'Databases', 'phpmyadmin.png', 'http://10.208.10.234/phpmyadmin/'],

            ['LMC Webmail', null, 'webmail.png', 'https://webmail.lagunametts.com/'],
            ['Family Link for tablets', null, 'family-link.jpg', 'https://familylink.google.com/'],
            ['Zabbix Monitoring System', null, 'zabbix.png', 'http://10.208.30.2/'],
        ];

        $now = now();

        foreach ($tools as $index => [$name, $category, $icon, $url]) {
            DB::table('it_tools')->insert([
                'name' => $name,
                'category' => $category,
                'icon' => '/images/tools/' . $icon,
                'url' => $url,
                'sort_order' => $index + 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        DB::table('it_tools')->insert([
            'name' => 'Watchguard',
            'category' => 'Security',
            'icon' => '/images/tools/watchguard.png',
            'url' => 'https://wglogin.watchguard.com/',
            'sort_order' => 7,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('it_tools');
    }
};