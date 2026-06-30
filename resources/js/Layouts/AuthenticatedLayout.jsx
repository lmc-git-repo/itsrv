import { useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const isSuperAdmin = user?.role === "superadmin";

    useEffect(() => {
        if (!isSuperAdmin) return;

        if (!("Notification" in window)) return;

        if (Notification.permission === "default") {
            Notification.requestPermission();
        }

        const checkLatestTicket = async () => {
            try {
                const response = await fetch(route("tickets.latest.employee"), {
                    headers: {
                        Accept: "application/json",
                    },
                });

                if (!response.ok) return;

                const ticket = await response.json();

                if (!ticket?.id) return;

                const lastSeenTicketId = localStorage.getItem("last_seen_employee_ticket_id");

                if (!lastSeenTicketId) {
                    localStorage.setItem("last_seen_employee_ticket_id", ticket.id);
                    return;
                }

                if (String(ticket.id) !== String(lastSeenTicketId)) {
                    localStorage.setItem("last_seen_employee_ticket_id", ticket.id);

                    if (Notification.permission === "granted") {
                        const notification = new Notification("New Employee Ticket", {
                            body: `${ticket.ticket_no} - ${ticket.employee_name} (${ticket.department})`,
                            icon: "/images/LMC-Logo-Wht.png",
                        });

                        notification.onclick = () => {
                            window.focus();
                            window.location.href = route("tickets.index");
                        };
                    }
                }
            } catch (error) {
                console.error("Ticket notification error:", error);
            }
        };

        checkLatestTicket();

        const interval = setInterval(checkLatestTicket, 5000);

        return () => clearInterval(interval);
    }, [isSuperAdmin]);

    return (
        <div className="min-h-screen flex flex-col bg-[#101E33] text-white dashboard-bg">
            <nav className="bg-[#0b1a2e] border-b border-white/10 nav-tight">
                <div className="w-full px-10">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/dashboard" className="flex items-center">
                            <img
                                src="/images/LMC-Logo-Wht.png"
                                alt="LMC Logo"
                                className="h-11 w-auto"
                            />
                        </Link>

                        <div className="flex items-center gap-10">
                            <div className="hidden md:flex gap-8 text-sm font-semibold tracking-wide">
                                <Link href="/dashboard" className="hover:text-blue-400">
                                    Dashboard
                                </Link>

                                <Link href={route('tickets.index')} className="hover:text-blue-400">
                                    Tickets
                                </Link>

                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center gap-1 text-white/80 hover:text-blue-400">
                                            Records
                                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('troublereport.index')}>
                                            Trouble Report
                                        </Dropdown.Link>

                                        <Dropdown.Link href="/records/transfer-slip">
                                            Transfer Slip
                                        </Dropdown.Link>

                                        <Dropdown.Link href={route('cptransferslip.index')}>
                                            Transfer Slip - Cellphone
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>

                                {isSuperAdmin && (
                                    <Link href="/it-tools" className="hover:text-blue-400">
                                        IT Tools
                                    </Link>
                                )}

                                {isSuperAdmin && (
                                    <Link href={route('users.index')} className="hover:text-blue-400">
                                        Users
                                    </Link>
                                )}

                                {isSuperAdmin && (
                                    <Link href={route('employees.index')} className="hover:text-blue-400">
                                        Employees
                                    </Link>
                                )}
                            </div>

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-2 text-sm font-semibold">
                                        {user.name}
                                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav>

            {header && <header className="px-10 py-3">{header}</header>}

            <main className="flex-1 w-full px-10 py-6">
                {children}
            </main>
        </div>
    );
}