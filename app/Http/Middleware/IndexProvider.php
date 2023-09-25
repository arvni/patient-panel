<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class IndexProvider
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return Response|RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $inputs["filters"] = array_merge($request->get("filters",[]), $request->except("filters", "page", "sort", "pageSize"));
        $inputs["page"] = $request->get("page", 1);
        $inputs["sort"] = $request->get("sort", ["field" => "id", "sort" => "desc"]);
        $inputs["pageSize"] = $request->get("pageSize", 20);
        $request->replace($inputs);
        return $next($request);
    }
}
