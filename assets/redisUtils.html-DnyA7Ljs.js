import{_ as n,o as s,c as a,e as p}from"./app-BQzoQ3UK.js";const e={},t=p(`<h1 id="redis工具类" tabindex="-1"><a class="header-anchor" href="#redis工具类"><span>redis工具类</span></a></h1><h2 id="redisconfigbean配置" tabindex="-1"><a class="header-anchor" href="#redisconfigbean配置"><span>RedisConfigBean配置</span></a></h2><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>context<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Bean</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>context<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Configuration</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>data<span class="token punctuation">.</span>redis<span class="token punctuation">.</span>connection<span class="token punctuation">.</span></span><span class="token class-name">RedisConnectionFactory</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>data<span class="token punctuation">.</span>redis<span class="token punctuation">.</span>core<span class="token punctuation">.</span></span><span class="token class-name">RedisTemplate</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>data<span class="token punctuation">.</span>redis<span class="token punctuation">.</span>serializer<span class="token punctuation">.</span></span><span class="token class-name">RedisSerializer</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>data<span class="token punctuation">.</span>redis<span class="token punctuation">.</span>serializer<span class="token punctuation">.</span></span><span class="token class-name">StringRedisSerializer</span></span><span class="token punctuation">;</span>

<span class="token annotation punctuation">@Configuration</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">RedisConfig</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">RedisTemplate</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">redisTemplate</span><span class="token punctuation">(</span><span class="token class-name">RedisConnectionFactory</span> factory<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">RedisTemplate</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> template <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">RedisTemplate</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">RedisSerializer</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> redisSerializer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">StringRedisSerializer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        template<span class="token punctuation">.</span><span class="token function">setConnectionFactory</span><span class="token punctuation">(</span>factory<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//key序列化方式</span>
        template<span class="token punctuation">.</span><span class="token function">setKeySerializer</span><span class="token punctuation">(</span>redisSerializer<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//value序列化</span>
        template<span class="token punctuation">.</span><span class="token function">setValueSerializer</span><span class="token punctuation">(</span>redisSerializer<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//key haspMap序列化</span>
        template<span class="token punctuation">.</span><span class="token function">setHashKeySerializer</span><span class="token punctuation">(</span>redisSerializer<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//value hashmap序列化</span>
        template<span class="token punctuation">.</span><span class="token function">setHashValueSerializer</span><span class="token punctuation">(</span>redisSerializer<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> template<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="redisutil工具类" tabindex="-1"><a class="header-anchor" href="#redisutil工具类"><span>RedisUtil工具类</span></a></h2><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>data<span class="token punctuation">.</span>redis<span class="token punctuation">.</span>connection<span class="token punctuation">.</span></span><span class="token class-name">RedisConnectionFactory</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>data<span class="token punctuation">.</span>redis<span class="token punctuation">.</span>core<span class="token punctuation">.</span></span><span class="token operator">*</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>data<span class="token punctuation">.</span>redis<span class="token punctuation">.</span>core<span class="token punctuation">.</span>query<span class="token punctuation">.</span></span><span class="token class-name">SortQuery</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>stereotype<span class="token punctuation">.</span></span><span class="token class-name">Component</span></span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>nio<span class="token punctuation">.</span>charset<span class="token punctuation">.</span></span><span class="token class-name">StandardCharsets</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">ArrayList</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">List</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Map</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Set</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">TimeUnit</span></span><span class="token punctuation">;</span>


<span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">RedisUtil</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">RedisTemplate</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> redisTemplate<span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">HashOperations</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> hashOperations<span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">ValueOperations</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> valueOperations<span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">ListOperations</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> listOperations<span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">SetOperations</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> setOperations<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token class-name">RedisUtil</span><span class="token punctuation">(</span><span class="token class-name">RedisTemplate</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> redisTemplate<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">RedisUtil</span><span class="token punctuation">.</span>redisTemplate <span class="token operator">=</span> redisTemplate<span class="token punctuation">;</span>
        <span class="token class-name">RedisUtil</span><span class="token punctuation">.</span>hashOperations <span class="token operator">=</span> redisTemplate<span class="token punctuation">.</span><span class="token function">opsForHash</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">RedisUtil</span><span class="token punctuation">.</span>valueOperations <span class="token operator">=</span> redisTemplate<span class="token punctuation">.</span><span class="token function">opsForValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">RedisUtil</span><span class="token punctuation">.</span>listOperations <span class="token operator">=</span> redisTemplate<span class="token punctuation">.</span><span class="token function">opsForList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">RedisUtil</span><span class="token punctuation">.</span>setOperations <span class="token operator">=</span> redisTemplate<span class="token punctuation">.</span><span class="token function">opsForSet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 根据正则匹配key获取所有对应的key
     *
     * <span class="token keyword">@param</span> <span class="token parameter">pattern</span> 正则匹配路径 例如examUserId:* 获取 examUserId:101,examUserId:102,examUserId:103...
     * <span class="token keyword">@return</span> List<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>String</span><span class="token punctuation">&gt;</span></span>
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">findMatchingKeys</span><span class="token punctuation">(</span><span class="token class-name">String</span> pattern<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> matchedKeys <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token class-name">ScanOptions</span> scanOptions <span class="token operator">=</span> <span class="token class-name">ScanOptions</span><span class="token punctuation">.</span><span class="token function">scanOptions</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span>pattern<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">count</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">RedisConnectionFactory</span> connectionFactory <span class="token operator">=</span> redisTemplate<span class="token punctuation">.</span><span class="token function">getConnectionFactory</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">==</span> connectionFactory<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">RuntimeException</span><span class="token punctuation">(</span><span class="token string">&quot;使用 ScanOptions 获取 keys 时 connectionFactory 获取为空&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">try</span> <span class="token punctuation">(</span><span class="token class-name">Cursor</span><span class="token operator">&lt;</span><span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">&gt;</span> cursor <span class="token operator">=</span> connectionFactory<span class="token punctuation">.</span><span class="token function">getConnection</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">scan</span><span class="token punctuation">(</span>scanOptions<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">while</span> <span class="token punctuation">(</span>cursor<span class="token punctuation">.</span><span class="token function">hasNext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> rawKey <span class="token operator">=</span> cursor<span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token class-name">String</span> key <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">String</span><span class="token punctuation">(</span>rawKey<span class="token punctuation">,</span> <span class="token class-name">StandardCharsets</span><span class="token punctuation">.</span><span class="token constant">UTF_8</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                matchedKeys<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">return</span> matchedKeys<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 排序
     *
     * <span class="token keyword">@param</span> <span class="token parameter">sortQuery</span> 排序条件
     * <span class="token keyword">@return</span> List<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>String</span><span class="token punctuation">&gt;</span></span>
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">sort</span><span class="token punctuation">(</span><span class="token class-name">SortQuery</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> sortQuery<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> redisTemplate<span class="token punctuation">.</span><span class="token function">sort</span><span class="token punctuation">(</span>sortQuery<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 给一个指定的 key 值附加过期时间
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">expire</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token keyword">long</span> time<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        redisTemplate<span class="token punctuation">.</span><span class="token function">expire</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> time<span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 根据key 获取过期时间
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span> 键 不能为null
     * <span class="token keyword">@return</span> 时间(秒) 返回 0 代表为永久有效
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">long</span> <span class="token function">getTime</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Long</span> expire <span class="token operator">=</span> redisTemplate<span class="token punctuation">.</span><span class="token function">getExpire</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token keyword">null</span> <span class="token operator">==</span> expire <span class="token operator">?</span> <span class="token operator">-</span><span class="token number">1</span> <span class="token operator">:</span> expire<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 根据key 判断该key是否已过期
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">boolean</span> <span class="token function">hasKey</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">Boolean</span><span class="token punctuation">.</span><span class="token constant">TRUE</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>redisTemplate<span class="token punctuation">.</span><span class="token function">hasKey</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 移除指定key 的过期时间
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">boolean</span> <span class="token function">persist</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">Boolean</span><span class="token punctuation">.</span><span class="token constant">TRUE</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>redisTemplate<span class="token punctuation">.</span><span class="token function">boundValueOps</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">persist</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 从redis中删除指定的一个key
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span> redisKey
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">del</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        redisTemplate<span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">//region String类型</span>
    <span class="token comment">//- - - - - - - - - - - - - - - - - - - - -  String类型 - - - - - - - - - - - - - - - - - - - -</span>

    <span class="token doc-comment comment">/**
     * 根据key获取值
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span> 键
     * <span class="token keyword">@return</span> 值
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Object</span> <span class="token function">get</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> key <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">?</span> <span class="token keyword">null</span> <span class="token operator">:</span> valueOperations<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 将值放入缓存
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>   键
     * <span class="token keyword">@param</span> <span class="token parameter">value</span> 值
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">set</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        valueOperations<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 将值放入缓存并设置时间
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>   键
     * <span class="token keyword">@param</span> <span class="token parameter">value</span> 值
     * <span class="token keyword">@param</span> <span class="token parameter">time</span>  时间(秒) -1为无期限
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">set</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span> value<span class="token punctuation">,</span> <span class="token keyword">long</span> time<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        valueOperations<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> value<span class="token punctuation">,</span> time<span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 批量添加 key (重复的键会覆盖)
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">batchSet</span><span class="token punctuation">(</span><span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> keyAndValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        valueOperations<span class="token punctuation">.</span><span class="token function">multiSet</span><span class="token punctuation">(</span>keyAndValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 批量添加 key-value 只有在键不存在时,才添加
     * map 中只要有一个key存在,则全部不添加
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">batchSetIfAbsent</span><span class="token punctuation">(</span><span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> keyAndValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        valueOperations<span class="token punctuation">.</span><span class="token function">multiSetIfAbsent</span><span class="token punctuation">(</span>keyAndValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 对一个 key-value 的值进行加减操作,
     * 如果该 key 不存在 将创建一个key 并赋值该 number
     * 如果 key 存在,但 value 不是长整型 ,将报错
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Long</span> <span class="token function">increment</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token keyword">long</span> number<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> valueOperations<span class="token punctuation">.</span><span class="token function">increment</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> number<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 对一个 key-value 的值进行加减操作,
     * 如果该 key 不存在 将创建一个key 并赋值该 number
     * 如果 key 存在,但 value 不是 纯数字 ,将报错
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Double</span> <span class="token function">increment</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token keyword">double</span> number<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> valueOperations<span class="token punctuation">.</span><span class="token function">increment</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> number<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">//endregion</span>

    <span class="token comment">//region set类型</span>
    <span class="token comment">//- - - - - - - - - - - - - - - - - - - - -  set类型 - - - - - - - - - - - - - - - - - - - -</span>

    <span class="token doc-comment comment">/**
     * 将数据放入set缓存
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">sSet</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        setOperations<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 获取变量中的值
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Set</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">members</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> setOperations<span class="token punctuation">.</span><span class="token function">members</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 随机获取变量中指定个数的元素
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">randomMembers</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token keyword">long</span> count<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        setOperations<span class="token punctuation">.</span><span class="token function">randomMembers</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> count<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 随机获取变量中的元素
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token function">randomMember</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> setOperations<span class="token punctuation">.</span><span class="token function">randomMember</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 弹出变量中的元素
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Object</span> <span class="token function">pop</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> setOperations<span class="token punctuation">.</span><span class="token function">pop</span><span class="token punctuation">(</span><span class="token string">&quot;key&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 获取变量中值的长度
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">long</span> <span class="token function">size</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Long</span> size <span class="token operator">=</span> setOperations<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token keyword">null</span> <span class="token operator">==</span> size <span class="token operator">?</span> <span class="token operator">-</span><span class="token number">1</span> <span class="token operator">:</span> size<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 根据value从一个set中查询,是否存在
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>   键
     * <span class="token keyword">@param</span> <span class="token parameter">value</span> 值
     * <span class="token keyword">@return</span> true 存在 false不存在
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">boolean</span> <span class="token function">sHasKey</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">Object</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">Boolean</span><span class="token punctuation">.</span><span class="token constant">TRUE</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>setOperations<span class="token punctuation">.</span><span class="token function">isMember</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 检查给定的元素是否在变量中。
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">boolean</span> <span class="token function">isMember</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">Object</span> obj<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">Boolean</span><span class="token punctuation">.</span><span class="token constant">TRUE</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>setOperations<span class="token punctuation">.</span><span class="token function">isMember</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> obj<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 转移变量的元素值到目的变量。
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">boolean</span> <span class="token function">move</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span> value<span class="token punctuation">,</span> <span class="token class-name">String</span> destKey<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">Boolean</span><span class="token punctuation">.</span><span class="token constant">TRUE</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>setOperations<span class="token punctuation">.</span><span class="token function">move</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> value<span class="token punctuation">,</span> destKey<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 批量移除set缓存中元素
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>    set集合Key
     * <span class="token keyword">@param</span> <span class="token parameter">values</span> set集合中需要移除的元素值
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">remove</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> values<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        redisTemplate<span class="token punctuation">.</span><span class="token function">opsForSet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> values<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 通过给定的key求2个set变量的差值
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>     set集合Key
     * <span class="token keyword">@param</span> <span class="token parameter">destKey</span> set集合Key
     * <span class="token keyword">@return</span> Set<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>String</span><span class="token punctuation">&gt;</span></span> 两个set集合的差值
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Set</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">difference</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span> destKey<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> setOperations<span class="token punctuation">.</span><span class="token function">difference</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> destKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 弹出元素并删除
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span> 要弹出的key
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token function">popValue</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> setOperations<span class="token punctuation">.</span><span class="token function">pop</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">//endregion</span>

    <span class="token comment">//region hash类型</span>
    <span class="token comment">//- - - - - - - - - - - - - - - - - - - - -  hash类型 - - - - - - - - - - - - - - - - - - - -</span>

    <span class="token doc-comment comment">/**
     * hash 添加一个hash类型的数据进行存储
     * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
     * 给一个key设置所有相应的属性
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">hmSet</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> map<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        hashOperations<span class="token punctuation">.</span><span class="token function">putAll</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> map<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * hash表设置一个值
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>     hash表Key
     * <span class="token keyword">@param</span> <span class="token parameter">hashKey</span> hash表字段Key
     * <span class="token keyword">@param</span> <span class="token parameter">value</span>   hash表字段Key所对应的值
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">hmSet</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span> hashKey<span class="token punctuation">,</span> <span class="token class-name">String</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        hashOperations<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> hashKey<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * hash 获取某个key下所有的value
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">hashValues</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> hashOperations<span class="token punctuation">.</span><span class="token function">values</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


    <span class="token doc-comment comment">/**
     * 获取当前key下所有的键值对
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span> 要取的key值
     * <span class="token keyword">@return</span> 返回所有键值对
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">hashEntries</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> hashOperations<span class="token punctuation">.</span><span class="token function">entries</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 获取某个 hash key 下指定hashKey的值
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>      key
     * <span class="token keyword">@param</span> <span class="token parameter">hashKeys</span> hashKeys
     * <span class="token keyword">@return</span> hashKey的value值
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">hashMultiGet</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> hashKeys<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> hashOperations<span class="token punctuation">.</span><span class="token function">multiGet</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> hashKeys<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 验证指定 key 下 有没有指定的 hash key
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>     hash表Key
     * <span class="token keyword">@param</span> <span class="token parameter">hashKey</span> hash表字段key
     * <span class="token keyword">@return</span> 存在为true, 不存在为false
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">boolean</span> <span class="token function">hashKey</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span> hashKey<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> redisTemplate<span class="token punctuation">.</span><span class="token function">opsForHash</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">hasKey</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> hashKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


    <span class="token doc-comment comment">/**
     * 获取指定key的值string
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>     hash表Key
     * <span class="token keyword">@param</span> <span class="token parameter">hashKey</span> hash表字段key
     * <span class="token keyword">@return</span> String
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token function">hGet</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span> hashKey<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> hashOperations<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> hashKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 删除指定 hash 的 HashKey
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>      hash表Key
     * <span class="token keyword">@param</span> <span class="token parameter">hashKeys</span> hash表字段Key(多个)
     * <span class="token keyword">@return</span> 删除成功的 数量
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Long</span> <span class="token function">delete</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> hashKeys<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> hashOperations<span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token class-name">Object</span><span class="token punctuation">)</span> hashKeys<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 给指定 hash 的 hash key 做增减操作
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>     hash表Key
     * <span class="token keyword">@param</span> <span class="token parameter">hashKey</span> hash表字段Key,一般称为hashKey
     * <span class="token keyword">@param</span> <span class="token parameter">number</span>  增减值
     * <span class="token keyword">@return</span> Double
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Double</span> <span class="token function">increment</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span> hashKey<span class="token punctuation">,</span> <span class="token class-name">Double</span> number<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> hashOperations<span class="token punctuation">.</span><span class="token function">increment</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> hashKey<span class="token punctuation">,</span> number<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 获取 key 下的 所有 hash key 字段
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span> hash表Key
     * <span class="token keyword">@return</span> Set<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>String</span><span class="token punctuation">&gt;</span></span>
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Set</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">hashKeys</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> hashOperations<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 获取指定 hash 下面的 键值对 数量
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span> hash表Key
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Long</span> <span class="token function">hashSize</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> hashOperations<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">//endregion</span>

    <span class="token comment">//region list类型</span>
    <span class="token comment">//- - - - - - - - - - - - - - - - - - - - -  list类型 - - - - - - - - - - - - - - - - - - - -</span>

    <span class="token doc-comment comment">/**
     * 在变量左边添加元素值
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>   listKey
     * <span class="token keyword">@param</span> <span class="token parameter">value</span> 元素值
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">leftPush</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        listOperations<span class="token punctuation">.</span><span class="token function">leftPush</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


    <span class="token doc-comment comment">/**
     * 获取集合指定位置的值。
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>   listKey
     * <span class="token keyword">@param</span> <span class="token parameter">index</span> 索引位置
     * <span class="token keyword">@return</span> String
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token function">index</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token keyword">long</span> index<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> listOperations<span class="token punctuation">.</span><span class="token function">index</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> index<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


    <span class="token doc-comment comment">/**
     * 获取指定区间的值。
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>   listKey
     * <span class="token keyword">@param</span> <span class="token parameter">start</span> 起始区间
     * <span class="token keyword">@param</span> <span class="token parameter">end</span>   结束区间
     * <span class="token keyword">@return</span> List<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>String</span><span class="token punctuation">&gt;</span></span>
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">range</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token keyword">long</span> start<span class="token punctuation">,</span> <span class="token keyword">long</span> end<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> redisTemplate<span class="token punctuation">.</span><span class="token function">opsForList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">range</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> start<span class="token punctuation">,</span> end<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


    <span class="token doc-comment comment">/**
     * 把最后一个参数值放到指定集合的第一个出现中间参数的前面，如果中间参数值存在的话。
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>   listKey
     * <span class="token keyword">@param</span> <span class="token parameter">pivot</span> 某个值,将value放置于第一个该值前
     * <span class="token keyword">@param</span> <span class="token parameter">value</span> 元素值
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">leftPush</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span> pivot<span class="token punctuation">,</span> <span class="token class-name">String</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        redisTemplate<span class="token punctuation">.</span><span class="token function">opsForList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">leftPush</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> pivot<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 向左边批量添加参数元素。
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>    listKey
     * <span class="token keyword">@param</span> <span class="token parameter">values</span> 多个元素数组
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">leftPushAll</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> values<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        redisTemplate<span class="token punctuation">.</span><span class="token function">opsForList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">leftPushAll</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> values<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 向集合最右边添加元素。
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>   listKey
     * <span class="token keyword">@param</span> <span class="token parameter">value</span> 元素值
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">rightPush</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        listOperations<span class="token punctuation">.</span><span class="token function">rightPush</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


    <span class="token doc-comment comment">/**
     * 向集合最右边添加元素。
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>        listKey
     * <span class="token keyword">@param</span> <span class="token parameter">value</span>      元素值
     * <span class="token keyword">@param</span> <span class="token parameter">expireTime</span> 过期时间
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">rightPush</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span> value<span class="token punctuation">,</span> <span class="token keyword">long</span> expireTime<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        listOperations<span class="token punctuation">.</span><span class="token function">rightPush</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">expire</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> expireTime<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 向左边批量添加参数元素。
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>    listKey
     * <span class="token keyword">@param</span> <span class="token parameter">values</span> 多个元素数组
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">rightPushAll</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> values<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        listOperations<span class="token punctuation">.</span><span class="token function">rightPushAll</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> values<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 向已存在的集合中添加元素。
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>   listKey
     * <span class="token keyword">@param</span> <span class="token parameter">value</span> 元素值
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">rightPushIfPresent</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        listOperations<span class="token punctuation">.</span><span class="token function">rightPushIfPresent</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 向已存在的集合中添加元素。
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">long</span> <span class="token function">listLength</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Long</span> size <span class="token operator">=</span> listOperations<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token keyword">null</span> <span class="token operator">==</span> size <span class="token operator">?</span> <span class="token operator">-</span><span class="token number">1</span> <span class="token operator">:</span> size<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 移除集合中的左边第一个元素。
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span> listKey
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">leftPop</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        listOperations<span class="token punctuation">.</span><span class="token function">leftPop</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 移除集合中左边的元素在等待的时间里，如果超过等待的时间仍没有元素则退出。
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>     redisKey
     * <span class="token keyword">@param</span> <span class="token parameter">timeout</span> 等待时间
     * <span class="token keyword">@param</span> <span class="token parameter">unit</span>    时间类型
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">leftPop</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token keyword">long</span> timeout<span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span> unit<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        listOperations<span class="token punctuation">.</span><span class="token function">leftPop</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> timeout<span class="token punctuation">,</span> unit<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 移除集合中右边的元素。
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span> 删除listKey中最右侧的元素
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">rightPop</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        listOperations<span class="token punctuation">.</span><span class="token function">rightPop</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 移除集合中右边的元素在等待的时间里，如果超过等待的时间仍没有元素则退出。
     *
     * <span class="token keyword">@param</span> <span class="token parameter">key</span>     redisKey
     * <span class="token keyword">@param</span> <span class="token parameter">timeout</span> 等待时间
     * <span class="token keyword">@param</span> <span class="token parameter">unit</span>    时间类型
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">rightPop</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token keyword">long</span> timeout<span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span> unit<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        listOperations<span class="token punctuation">.</span><span class="token function">rightPop</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> timeout<span class="token punctuation">,</span> unit<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">//endregion</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),c=[t];function o(l,i){return s(),a("div",null,c)}const k=n(e,[["render",o],["__file","redisUtils.html.vue"]]),r=JSON.parse('{"path":"/dev/java/redisUtils.html","title":"redis工具类","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"RedisConfigBean配置","slug":"redisconfigbean配置","link":"#redisconfigbean配置","children":[]},{"level":2,"title":"RedisUtil工具类","slug":"redisutil工具类","link":"#redisutil工具类","children":[]}],"git":{"updatedTime":1717731361000,"contributors":[{"name":"黑色的小火苗","email":"jiashuaijie@yeah.net","commits":1}]},"filePathRelative":"dev/java/redisUtils.md","excerpt":"\\n<h2>RedisConfigBean配置</h2>\\n<div class=\\"language-java\\" data-ext=\\"java\\" data-title=\\"java\\"><pre class=\\"language-java\\"><code><span class=\\"token keyword\\">import</span> <span class=\\"token import\\"><span class=\\"token namespace\\">org<span class=\\"token punctuation\\">.</span>springframework<span class=\\"token punctuation\\">.</span>context<span class=\\"token punctuation\\">.</span>annotation<span class=\\"token punctuation\\">.</span></span><span class=\\"token class-name\\">Bean</span></span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token keyword\\">import</span> <span class=\\"token import\\"><span class=\\"token namespace\\">org<span class=\\"token punctuation\\">.</span>springframework<span class=\\"token punctuation\\">.</span>context<span class=\\"token punctuation\\">.</span>annotation<span class=\\"token punctuation\\">.</span></span><span class=\\"token class-name\\">Configuration</span></span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token keyword\\">import</span> <span class=\\"token import\\"><span class=\\"token namespace\\">org<span class=\\"token punctuation\\">.</span>springframework<span class=\\"token punctuation\\">.</span>data<span class=\\"token punctuation\\">.</span>redis<span class=\\"token punctuation\\">.</span>connection<span class=\\"token punctuation\\">.</span></span><span class=\\"token class-name\\">RedisConnectionFactory</span></span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token keyword\\">import</span> <span class=\\"token import\\"><span class=\\"token namespace\\">org<span class=\\"token punctuation\\">.</span>springframework<span class=\\"token punctuation\\">.</span>data<span class=\\"token punctuation\\">.</span>redis<span class=\\"token punctuation\\">.</span>core<span class=\\"token punctuation\\">.</span></span><span class=\\"token class-name\\">RedisTemplate</span></span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token keyword\\">import</span> <span class=\\"token import\\"><span class=\\"token namespace\\">org<span class=\\"token punctuation\\">.</span>springframework<span class=\\"token punctuation\\">.</span>data<span class=\\"token punctuation\\">.</span>redis<span class=\\"token punctuation\\">.</span>serializer<span class=\\"token punctuation\\">.</span></span><span class=\\"token class-name\\">RedisSerializer</span></span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token keyword\\">import</span> <span class=\\"token import\\"><span class=\\"token namespace\\">org<span class=\\"token punctuation\\">.</span>springframework<span class=\\"token punctuation\\">.</span>data<span class=\\"token punctuation\\">.</span>redis<span class=\\"token punctuation\\">.</span>serializer<span class=\\"token punctuation\\">.</span></span><span class=\\"token class-name\\">StringRedisSerializer</span></span><span class=\\"token punctuation\\">;</span>\\n\\n<span class=\\"token annotation punctuation\\">@Configuration</span>\\n<span class=\\"token keyword\\">public</span> <span class=\\"token keyword\\">class</span> <span class=\\"token class-name\\">RedisConfig</span> <span class=\\"token punctuation\\">{</span>\\n\\n    <span class=\\"token annotation punctuation\\">@Bean</span>\\n    <span class=\\"token keyword\\">public</span> <span class=\\"token class-name\\">RedisTemplate</span><span class=\\"token generics\\"><span class=\\"token punctuation\\">&lt;</span><span class=\\"token class-name\\">String</span><span class=\\"token punctuation\\">,</span> <span class=\\"token class-name\\">String</span><span class=\\"token punctuation\\">&gt;</span></span> <span class=\\"token function\\">redisTemplate</span><span class=\\"token punctuation\\">(</span><span class=\\"token class-name\\">RedisConnectionFactory</span> factory<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token class-name\\">RedisTemplate</span><span class=\\"token generics\\"><span class=\\"token punctuation\\">&lt;</span><span class=\\"token class-name\\">String</span><span class=\\"token punctuation\\">,</span> <span class=\\"token class-name\\">String</span><span class=\\"token punctuation\\">&gt;</span></span> template <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">RedisTemplate</span><span class=\\"token generics\\"><span class=\\"token punctuation\\">&lt;</span><span class=\\"token punctuation\\">&gt;</span></span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token class-name\\">RedisSerializer</span><span class=\\"token generics\\"><span class=\\"token punctuation\\">&lt;</span><span class=\\"token class-name\\">String</span><span class=\\"token punctuation\\">&gt;</span></span> redisSerializer <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">StringRedisSerializer</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        template<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">setConnectionFactory</span><span class=\\"token punctuation\\">(</span>factory<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token comment\\">//key序列化方式</span>\\n        template<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">setKeySerializer</span><span class=\\"token punctuation\\">(</span>redisSerializer<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token comment\\">//value序列化</span>\\n        template<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">setValueSerializer</span><span class=\\"token punctuation\\">(</span>redisSerializer<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token comment\\">//key haspMap序列化</span>\\n        template<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">setHashKeySerializer</span><span class=\\"token punctuation\\">(</span>redisSerializer<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token comment\\">//value hashmap序列化</span>\\n        template<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">setHashValueSerializer</span><span class=\\"token punctuation\\">(</span>redisSerializer<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token keyword\\">return</span> template<span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n<span class=\\"token punctuation\\">}</span>\\n</code></pre></div>"}');export{k as comp,r as data};
