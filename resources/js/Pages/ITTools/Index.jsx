import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index() {
    const tools = [
        { name: "LMC Website for Users (External)", icon: "/images/tools/LMC-Logo-Wht.png", url: "https://lmcweb.synology.me/" },
        { name: "LMC Website for Users (Internal)", icon: "/images/tools/LMC-Logo-Wht.png", url: "http://10.208.10.234:8080/" },
        { name: "LMC Website - Login (External)", icon: "/images/tools/LMC-Logo-Wht.png", url: "https://lmcweb.synology.me/login" },
        { name: "LMC Website - Login (Internal)", icon: "/images/tools/LMC-Logo-Wht.png", url: "http://10.208.10.234:8080/login" },
        { name: "Inventory System", icon: "/images/tools/LMC-Logo-Wht.png", url: "https://10.208.10.10:446/login" },
        { name: "IT Ticketing System", icon: "/images/tools/LMC-Logo-Wht.png", url: "https://10.208.10.234:446/login" },
        { name: "CCTV Viewing 1", icon: "/images/tools/cctv.png", url: "http://192.168.10.9" },
        { name: "CCTV Viewing 1", icon: "/images/tools/cctv.png", url: "http://192.168.10.9" },
        { name: "CCTV Viewing 2", icon: "/images/tools/cctv.png", url: "http://192.168.10.10" },
        { name: "Firewall", icon: "/images/tools/firewall.png", url: "https://10.208.10.254/login?redir=%2F" },
        { name: "Watchguard", icon: "/images/tools/watchguard.png", url: "https://wglogin.watchguard.com/wglogin.onmicrosoft.com/B2C_1A_WatchGuardCloud_DEU/samlp/sso/login?SAMLRequest=jVPRbtowFH3vV0R5JwmBgWoBEg1dh8QgAtpJe0HGvgFLiZ35OoP%2B%2FWxDC506tLxYuj7n3HOPbwZIq7Im48bs5RJ%2BNYDmLgiOVSmR%2BKth2GhJFEWBRNIKkBhGVuPvM5JGCam1MoqpMvxAus2hiKCNUNKRppNhuJg%2FzhZP0%2Fmm6EKx7Xd7W3pPt0mf0S7tJ132hbN%2BUaQJv%2B%2F1UuBF3xFfQKPVGIZW0gshNjCVaKg0tpikvVbSaXWSddIjnYR00p8ONbHzCUmNZ%2B6NqZHE8WFXqp2Q0YEatt81VPOIqeq9rGQlmFaoCuPrD2m2aY83Pxz6yaGzUjV8M3l8jn1iMaKKPdV1zM8JPQjJhdzdjmZ7AiH5tl7nrXyxWjuJ8VtgmZLYVKBXoH8LBs%2FL2WWIk28OTcScnb%2BH8cW4LqkplK5O9qpDTBluUxaObJcgGDj7xAepR%2F%2BnO4ivOReVmsztcNNJrkrBXn3dfV9tb2r%2BnUE7avuK4K3CQ0kjsQYmCgE8fJcZl6U6ZBqogWFodANhEH9oft5k4H6vbWwGjibIVFVTLdC9PRwpM%2Be5L7Nfw7PSLuoSitHNXWaEOZwt5%2FY4KM3dgwOzvdeaWvNKm3NIn4qfXMc3bI%2Fu3q6vf9LRHw%3D%3D&RelayState=eyJyZWdpb24iOiAiZGV1In0%3D&Signature=I4pP8dZ8miKEwRhskeGltsMRav4WvxM9dUyXYYthTT0%2FP4%2FjuO%2FARvuvQJ0MVOR%2F7LvHpEd2uIGjNPTSO6z1X0JXdZW6tinp8geD%2FvL1oGglXnnW8jKvcwy%2Br3JQP2wqzUr3RMngJkNGi5Sfbs27djI0XdFCLdsox9xI1zybRtNeGJwdGfjqnTvDVDk71LMoXza9o0H1%2FUHDVZXXwuff3UZchVn2tEL41ZkSJuSFgTKb5Bp05T4wOQ9ZotoZeop6rkFgvVpU4NQM%2FJf2WmGSQk3Nfsny6pRDWoAsBgVyGTJ1jhO%2Fob6%2Bbgq0SsV4kpAGYe225JCFm1zrBruMMoSF4A%3D%3D&SigAlg=http%3A%2F%2Fwww.w3.org%2F2001%2F04%2Fxmldsig-more%23rsa-sha256" },
        { name: "Synology File Server", icon: "/images/tools/nas.png", url: "http://10.208.10.248:5000/#/signin" },
        { name: "Synology QC Server", icon: "/images/tools/nas.png", url: "http://10.208.10.251:5000/#/signin" },
        { name: "Synology Server Backup", icon: "/images/tools/nas.png", url: "https://10.208.10.10:5001/#/signin" },
        { name: "Synology New Server Backup 1", icon: "/images/tools/nas.png", url: "https://10.208.10.233:5001/#/signin" },
        { name: "Synology New Server Backup 2", icon: "/images/tools/nas.png", url: "https://10.208.10.234:5001/#/signin" },
        { name: "Admin Printer", icon: "/images/tools/printer.jpg", url: "http://10.208.10.101/home/index.html#hashHome" },
        { name: "Production Printer", icon: "/images/tools/printer.jpg", url: "http://10.208.10.102/home/index.html#hashHome" },
        { name: "Fujifilm Support Page", icon: "/images/tools/printer.jpg", url: "https://www.fujifilm.com/fbph/en" },
        { name: "Printer Add-Ons Color Impressions", icon: "/images/tools/printer.jpg", url: "https://docs.google.com/spreadsheets/d/15M9txVcQYHcPIyYX_BnT0-8wLi6tk5ehZL9Mk5_d14A/edit?gid=585269856#gid=585269856" },
        { name: "LMC Webmail", icon: "/images/tools/webmail.png", url: "https://webmail.lagunametts.com/" },
        { name: "CCTV Room L2 Switch", icon: "/images/tools/ruijie.png", url: "https://10.208.10.235/cgi-bin/luci/;stok=dc34d364c441f76cdf8fb9faa415bd9b/master" },
        { name: "DB Office L2 Switch", icon: "/images/tools/ruijie.png", url: "https://10.208.10.236/cgi-bin/luci/?stamp=1754730766" },
        { name: "Ruijie L3 Switch", icon: "/images/tools/ruijie.png", url: "https://10.208.10.244/app/login" },
        { name: "TP Link L2 Switch", icon: "/images/tools/tp-link.png", url: "https://10.208.10.245/" },
        { name: "Assy Prod Wifi", icon: "/images/tools/ruijie.png", url: "https://10.208.10.221/cgi-bin/luci/?stamp=1774858464" },
        { name: "QC/PPC Office Wifi", icon: "/images/tools/ruijie2.jpg", url: "https://10.208.20.240/index.htm" },
        { name: "Admin Office Wifi", icon: "/images/tools/ruijie2.jpg", url: "https://10.208.20.230/index.htm" },
        { name: "DC Office Wifi", icon: "/images/tools/engenius.png", url: "http://10.208.20.228/cgi-bin/luci" },
        { name: "DB Office Wifi", icon: "/images/tools/engenius.png", url: "http://10.208.20.225/cgi-bin/luci/;stok=e89aca4052223b5a60466aab9f6b38bb/html/index" },
        { name: "MC Prod Wifi", icon: "/images/tools/ruijie.png", url: "https://10.208.10.223/cgi-bin/luci/?stamp=1774854151" },
        { name: "DC Prod Wifi", icon: "/images/tools/engenius.png", url: "http://10.208.20.226/cgi-bin/luci" },
        { name: "Minobu RM Wifi", icon: "/images/tools/ruijie2.jpg", url: "https://10.208.10.230/" },
        { name: "HPI Prod Wifi", icon: "/images/tools/ruijie.png", url: "https://10.208.10.222/cgi-bin/luci/?stamp=1774854844" },
        { name: "Court Wifi", icon: "/images/tools/engenius.png", url: "http://192.168.10.5/cgi-bin/luci" },
        { name: "DC Office Wifi 2", icon: "/images/tools/ruijie.png", url: "https://10.208.10.219/cgi-bin/luci/?stamp=1774854916" },
        { name: "LMC Website Database", icon: "/images/tools/phpmyadmin.png", url: "https://10.208.10.233:8443/" },
        { name: "LMC IMS Database ", icon: "/images/tools/phpmyadmin.png", url: "https://10.208.10.10/phpmyadmin/" },
        { name: "LMC ITS Database", icon: "/images/tools/phpmyadmin.png", url: "http://10.208.10.234/phpmyadmin/" },
        { name: "Family Link for tablets", icon: "/images/tools/family-link.jpg", url: "https://familylink.google.com/" },

    ];

    const openTool = (url) => {
        window.open(url, "_blank");
    };

    return (
        <AuthenticatedLayout>
            <Head title="IT Tools" />

            <div className="ittools-page">
                <div className="ittools-title">IT CONTROL CENTER</div>

                <div className="ittools-grid-expanded">
                    {tools.map((tool, index) => (
                        <div
                            key={index}
                            className="ittools-tile-large"
                            onClick={() => openTool(tool.url)}
                        >
                            <img
                                src={tool.icon}
                                className="ittools-icon-large"
                                onError={(e) => e.target.style.display = "none"}
                            />

                            <div className="ittools-bar-info">
                                <span className="ittools-name-large">
                                    {tool.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}