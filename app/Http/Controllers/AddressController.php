<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Address;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    public function create()
    {
        return Inertia::render('Profile/Partials/AddressCreate'); 
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'full_address' => 'required|string',
            'city' => 'required|string',
            'postal_code' => 'required|string',
        ]);

        $request->user()->addresses()->create($validated);

        return redirect()->route('profile.edit')->with('message', 'Alamat berhasil ditambah!');
    }

    public function update(Request $request, Address $address)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:50',
            'full_address' => 'required|string',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:10',
            'is_default' => 'boolean',
        ]);

        if ($request->is_default) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address->update($validated);

        return back()->with('success', 'Address updated successfully.');
    }

    public function destroy(Address $address)
    {
        // Pastikan user hanya bisa menghapus alamat miliknya sendiri
        if (Auth::id() !== $address->user_id) {
            abort(403);
        }

        // Hapus alamat
        $address->delete();

        // Jika yang dihapus adalah alamat default, 
        // opsional: setel alamat lain yang tersisa menjadi default
        if ($address->is_default) {
            $nextAddress = Auth::user()->addresses()->first();
            if ($nextAddress) {
                $nextAddress->update(['is_default' => true]);
            }
        }

        return back()->with('success', 'Address deleted successfully.');
    }
}