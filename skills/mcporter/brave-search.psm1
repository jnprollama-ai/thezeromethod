# Brave Search API Integration
# Free tier: 2000 queries/month
# Docs: https://api.search.brave.com/

$env:BRAVE_API_KEY = "BSAZ1HtMA_dontfhgREOOendJFqJGJL"

function Search-Brave {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Query,
        
        [int]$Count = 10,
        [string]$Offset = "0",
        [string]$SearchType = "web"  # web, news, images
    )
    
    $headers = @{
        "X-Subscription-Token" = $env:BRAVE_API_KEY
        "Accept" = "application/json"
    }
    
    $url = "https://api.search.brave.com/res/v1/$SearchType/search?q=$([System.Web.HttpUtility]::UrlEncode($Query))&count=$Count&offset=$Offset"
    
    try {
        $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
        return $response
    }
    catch {
        Write-Error "Brave Search failed: $($_.Exception.Message)"
        return $null
    }
}

# Export function
Export-ModuleMember -Function Search-Brave
