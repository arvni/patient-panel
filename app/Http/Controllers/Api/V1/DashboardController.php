<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get dashboard data for mobile app
     */
    public function index(Request $request)
    {
        \Log::info('Dashboard request received', ['user_id' => $request->user()?->id]);
        try {
            $user = $request->user();

            if (!$user) {
                \Log::error('Dashboard: No authenticated user found');
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated.'
                ], 401);
            }

            \Log::info('Dashboard: Loading data for user', ['user_id' => $user->id, 'name' => $user->name]);

            // Get upcoming appointments count (reservations that are verified)
            $upcomingAppointments = $user->reservations()
                ->whereNotNull('verified_at')
                ->count();

            // Get pending lab results count
            $pendingLabResults = $user->acceptances()
                ->where('status', 'pending')
                ->count();

            // Menu items for dashboard
            $menuItems = [
                [
                    'id' => 'appointments',
                    'title' => 'My Appointments',
                    'description' => 'View and manage your scheduled appointments',
                    'route' => 'appointments',
                    'icon' => 'calendar',
                    'color' => '#4caf50',
                    'badge' => $upcomingAppointments > 0 ? $upcomingAppointments : null
                ],
                [
                    'id' => 'book-appointment',
                    'title' => 'Book Appointment',
                    'description' => 'Schedule a new appointment with your doctor',
                    'route' => 'book-appointment',
                    'icon' => 'add-circle',
                    'color' => '#2196f3',
                    'badge' => null
                ],
                [
                    'id' => 'lab-results',
                    'title' => 'Lab Results',
                    'description' => 'Access your test results and medical reports',
                    'route' => 'lab-results',
                    'icon' => 'biotech',
                    'color' => '#00bcd4',
                    'badge' => $pendingLabResults > 0 ? $pendingLabResults : null
                ],
                [
                    'id' => 'logout',
                    'title' => 'Logout',
                    'description' => 'Securely sign out of your account',
                    'route' => 'logout',
                    'icon' => 'exit',
                    'color' => '#f44336',
                    'badge' => null
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'mobile' => $user->mobile,
                        'email' => $user->email,
                    ],
                    'menuItems' => $menuItems,
                    'stats' => [
                        'upcomingAppointments' => $upcomingAppointments,
                        'pendingLabResults' => $pendingLabResults,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to load dashboard data.'
            ], 500);
        }
    }
}
