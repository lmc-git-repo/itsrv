<?php

namespace App\Http\Controllers;

use App\Models\ITTool;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ITToolController extends Controller
{
    private const CATEGORIES = [
        'Systems',
        'Servers',
        'Security',
        'CCTV',
        'Printers',
        'Switches',
        'Access Points',
        'Databases',
    ];

    private const CATEGORY_ICONS = [
        'Systems' => '/images/tools/LMC-Logo-Wht.png',
        'Servers' => '/images/tools/nas.png',
        'Security' => '/images/tools/firewall.png',
        'CCTV' => '/images/tools/cctv.png',
        'Printers' => '/images/tools/printer.jpg',
        'Switches' => '/images/tools/ruijie.png',
        'Access Points' => '/images/tools/ruijie2.jpg',
        'Databases' => '/images/tools/phpmyadmin.png',
    ];

    public function index()
    {
        return Inertia::render('ITTools/Index', [
            'tools' => ITTool::orderBy('sort_order')
                ->orderBy('id')
                ->get(),

            'groups' => collect(self::CATEGORIES)
                ->map(fn ($category) => [
                    'name' => $category,
                    'icon' => self::CATEGORY_ICONS[$category],
                ])
                ->values(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => [
                'nullable',
                Rule::in(self::CATEGORIES),
            ],
            'url' => [
                'required',
                'string',
                'max:4096',
                'regex:/^https?:\/\/\S+$/i',
            ],
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp,gif',
                'max:2048',
            ],
        ]);

        $icon = null;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('it-tools', 'public');

            $icon = '/storage/' . $path;
        }

        ITTool::create([
            'name' => $validated['name'],
            'category' => $validated['category'] ?? null,
            'url' => $validated['url'],
            'icon' => $icon,
            'sort_order' => (ITTool::max('sort_order') ?? 0) + 1,
        ]);

        return redirect()
            ->route('ittools.index')
            ->with('success', 'IT Tool added successfully.');
    }

    public function show(ITTool $ittool)
    {
        return response()->json($ittool);
    }

    public function update(Request $request, ITTool $ittool)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => [
                'nullable',
                Rule::in(self::CATEGORIES),
            ],
            'url' => [
                'required',
                'string',
                'max:4096',
                'regex:/^https?:\/\/\S+$/i',
            ],
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp,gif',
                'max:2048',
            ],
        ]);

        $icon = $ittool->icon;
        $previousIcon = $ittool->icon;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('it-tools', 'public');

            $icon = '/storage/' . $path;
        }

        $ittool->update([
            'name' => $validated['name'],
            'category' => $validated['category'] ?? null,
            'url' => $validated['url'],
            'icon' => $icon,
        ]);

        if ($request->hasFile('image')) {
            $this->deleteUploadedIcon($previousIcon);
        }

        return redirect()
            ->route('ittools.index')
            ->with('success', 'IT Tool updated successfully.');
    }

    public function destroy(ITTool $ittool)
    {
        $this->deleteUploadedIcon($ittool->icon);

        $ittool->delete();

        return redirect()
            ->route('ittools.index')
            ->with('success', 'IT Tool deleted successfully.');
    }

    private function deleteUploadedIcon(?string $icon): void
    {
        if (!$icon) {
            return;
        }

        $path = parse_url($icon, PHP_URL_PATH);

        if (!str_starts_with($path ?? '', '/storage/it-tools/')) {
            return;
        }

        Storage::disk('public')->delete(
            ltrim(substr($path, strlen('/storage/')), '/')
        );
    }
}