import{_ as n,o as s,c as a,e}from"./app-BQzoQ3UK.js";const p={},t=e(`<h1 id="工厂模式" tabindex="-1"><a class="header-anchor" href="#工厂模式"><span>工厂模式</span></a></h1><h2 id="介绍" tabindex="-1"><a class="header-anchor" href="#介绍"><span>介绍</span></a></h2><p>定义一个创建对象的接口，让其子类自己决定实例化哪一个工厂类，工厂模式使其创建过程延迟到子类进行。</p><h2 id="案例" tabindex="-1"><a class="header-anchor" href="#案例"><span>案例</span></a></h2><p>我们可以根据情况来创建绘画形状为需求来说明并实现工厂模式.</p><h3 id="创建工厂接口" tabindex="-1"><a class="header-anchor" href="#创建工厂接口"><span>创建工厂接口</span></a></h3><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">Shape</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 判断是否应该自身执行
     *
     * <span class="token keyword">@param</span> <span class="token parameter">shape</span> 枚举类
     * <span class="token keyword">@return</span> boolean 应该本身执行是返回true 不应该执行返回false
     */</span>
    <span class="token keyword">boolean</span> <span class="token function">supportsInternal</span><span class="token punctuation">(</span><span class="token class-name">ShapeEnum</span> shape<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 执行绘画操作
     */</span>
    <span class="token keyword">void</span> <span class="token function">draw</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建枚举</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">enum</span> <span class="token class-name">ShapeEnum</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/**
     * 圆形
     */</span>
    <span class="token constant">CIRCLE</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * 矩形
     */</span>
    <span class="token constant">RECTANGLE</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * 正方形
     */</span>
    <span class="token constant">SQUARE</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建相应形状类" tabindex="-1"><a class="header-anchor" href="#创建相应形状类"><span>创建相应形状类</span></a></h3><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 圆形形状类
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Circle</span> <span class="token keyword">implements</span> <span class="token class-name">Shape</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">supportsInternal</span><span class="token punctuation">(</span><span class="token class-name">ShapeEnum</span> shape<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">ShapeEnum</span><span class="token punctuation">.</span><span class="token constant">CIRCLE</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>shape<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">draw</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;Inside Circle::draw() method.&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 正方形形状类
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Square</span> <span class="token keyword">implements</span> <span class="token class-name">Shape</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">supportsInternal</span><span class="token punctuation">(</span><span class="token class-name">ShapeEnum</span> shape<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">ShapeEnum</span><span class="token punctuation">.</span><span class="token constant">SQUARE</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>shape<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">draw</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;Inside Square::draw() method.&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 矩形形状类
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Rectangle</span> <span class="token keyword">implements</span> <span class="token class-name">Shape</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">supportsInternal</span><span class="token punctuation">(</span><span class="token class-name">ShapeEnum</span> shape<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">ShapeEnum</span><span class="token punctuation">.</span><span class="token constant">RECTANGLE</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>shape<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">draw</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;Inside Rectangle::draw() method.&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用工厂创建对应形状" tabindex="-1"><a class="header-anchor" href="#使用工厂创建对应形状"><span>使用工厂创建对应形状</span></a></h3><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Objects</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">ServiceLoader</span></span><span class="token punctuation">;</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ShapeFactory</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Shape</span> <span class="token function">getShape</span><span class="token punctuation">(</span><span class="token class-name">ShapeEnum</span> shapeEnum<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ServiceLoader</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Shape</span><span class="token punctuation">&gt;</span></span> shapes <span class="token operator">=</span> <span class="token class-name">ServiceLoader</span><span class="token punctuation">.</span><span class="token function">load</span><span class="token punctuation">(</span><span class="token class-name">Shape</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Shape</span> result <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Shape</span> shape <span class="token operator">:</span> shapes<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>shape<span class="token punctuation">.</span><span class="token function">supportsInternal</span><span class="token punctuation">(</span>shapeEnum<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                result <span class="token operator">=</span> shape<span class="token punctuation">;</span>
                <span class="token keyword">break</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 最终应该是有匹配结果的,如果没有匹配结果那么我应该直接报错回去</span>
        <span class="token keyword">return</span> <span class="token class-name">Objects</span><span class="token punctuation">.</span><span class="token function">requireNonNull</span><span class="token punctuation">(</span>result<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用ServiceLoader扫描相关对象时我们需要在<code>META-INF/services</code>下创建以Shape的全路径为名的文件[以我的为例文件名就是 <code>org.bamboo.shape.Shape</code>],将要扫描的文件全路径写入到对应文件</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>org.bamboo.shape.Circle
org.bamboo.shape.Rectangle
org.bamboo.shape.Square
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>ps: ServiceLoader 为java本身的工具类所以不需要担心兼容问题但是jdk应该是需要1.8以上.并且读取顺序为从第一行顺序向下读取.</p></blockquote><h3 id="测试是否可行" tabindex="-1"><a class="header-anchor" href="#测试是否可行"><span>测试是否可行</span></a></h3><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ShapeTest</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ShapeFactory</span><span class="token punctuation">.</span><span class="token function">getShape</span><span class="token punctuation">(</span><span class="token class-name">ShapeEnum</span><span class="token punctuation">.</span><span class="token constant">CIRCLE</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">draw</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 输出结果为:  Inside Circle::draw() method.</span>
        <span class="token comment">// 说明这个方法是可行的.</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,20),c=[t];function l(o,i){return s(),a("div",null,c)}const d=n(p,[["render",l],["__file","工厂模式.html.vue"]]),r=JSON.parse('{"path":"/dev/java/%E5%B7%A5%E5%8E%82%E6%A8%A1%E5%BC%8F.html","title":"工厂模式","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"介绍","slug":"介绍","link":"#介绍","children":[]},{"level":2,"title":"案例","slug":"案例","link":"#案例","children":[{"level":3,"title":"创建工厂接口","slug":"创建工厂接口","link":"#创建工厂接口","children":[]},{"level":3,"title":"创建相应形状类","slug":"创建相应形状类","link":"#创建相应形状类","children":[]},{"level":3,"title":"使用工厂创建对应形状","slug":"使用工厂创建对应形状","link":"#使用工厂创建对应形状","children":[]},{"level":3,"title":"测试是否可行","slug":"测试是否可行","link":"#测试是否可行","children":[]}]}],"git":{"updatedTime":1717731361000,"contributors":[{"name":"黑色的小火苗","email":"jiashuaijie@yeah.net","commits":1}]},"filePathRelative":"dev/java/工厂模式.md","excerpt":"\\n<h2>介绍</h2>\\n<p>定义一个创建对象的接口，让其子类自己决定实例化哪一个工厂类，工厂模式使其创建过程延迟到子类进行。</p>\\n<h2>案例</h2>\\n<p>我们可以根据情况来创建绘画形状为需求来说明并实现工厂模式.</p>\\n<h3>创建工厂接口</h3>\\n<div class=\\"language-java\\" data-ext=\\"java\\" data-title=\\"java\\"><pre class=\\"language-java\\"><code><span class=\\"token keyword\\">public</span> <span class=\\"token keyword\\">interface</span> <span class=\\"token class-name\\">Shape</span> <span class=\\"token punctuation\\">{</span>\\n\\n    <span class=\\"token doc-comment comment\\">/**\\n     * 判断是否应该自身执行\\n     *\\n     * <span class=\\"token keyword\\">@param</span> <span class=\\"token parameter\\">shape</span> 枚举类\\n     * <span class=\\"token keyword\\">@return</span> boolean 应该本身执行是返回true 不应该执行返回false\\n     */</span>\\n    <span class=\\"token keyword\\">boolean</span> <span class=\\"token function\\">supportsInternal</span><span class=\\"token punctuation\\">(</span><span class=\\"token class-name\\">ShapeEnum</span> shape<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n\\n    <span class=\\"token doc-comment comment\\">/**\\n     * 执行绘画操作\\n     */</span>\\n    <span class=\\"token keyword\\">void</span> <span class=\\"token function\\">draw</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token punctuation\\">}</span>\\n</code></pre></div>"}');export{d as comp,r as data};
