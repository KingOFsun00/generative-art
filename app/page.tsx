"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Download, Shuffle, Settings, Palette, Sparkles, ImageIcon, Wand2, Share2, Heart, Eye } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const UNSPLASH_ACCESS_KEY = "AFHvJmJON5UsXS5uhW1x9y2omkl4dIUhJJYTc38j5gc"

const RANDOM_THEMES = [
  "mystical forest with glowing mushrooms",
  "cyberpunk neon cityscape at night",
  "ancient temple in misty mountains",
  "underwater coral reef paradise",
  "space nebula with distant galaxies",
  "japanese zen garden in autumn",
  "steampunk clockwork machinery",
  "aurora borealis over frozen lake",
  "desert oasis with palm trees",
  "floating islands in the clouds",
  "bioluminescent deep sea creatures",
  "medieval castle on cliff edge",
  "abstract geometric patterns",
  "vintage art deco architecture",
  "tropical rainforest canopy",
]

const ARTISTIC_EFFECTS = [
  { id: "impressionist", name: "Impressionista", icon: "🎨" },
  { id: "watercolor", name: "Aquarela", icon: "💧" },
  { id: "oil-painting", name: "Pintura a Óleo", icon: "🖌️" },
  { id: "digital-glitch", name: "Glitch Digital", icon: "⚡" },
  { id: "mosaic", name: "Mosaico", icon: "🔷" },
  { id: "sketch", name: "Esboço", icon: "✏️" },
  { id: "pop-art", name: "Pop Art", icon: "🎭" },
  { id: "abstract", name: "Abstrato", icon: "🌀" },
]

interface ArtworkSettings {
  effect: string
  intensity: number
  colorVariance: number
  brushSize: number
  complexity: number
}

export default function GenerativeArtGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [settings, setSettings] = useState<ArtworkSettings>({
    effect: "impressionist",
    intensity: 50,
    colorVariance: 30,
    brushSize: 15,
    complexity: 60,
  })
  const [showSettings, setShowSettings] = useState(false)
  const [artworkHistory, setArtworkHistory] = useState<string[]>([])
  const [likes, setLikes] = useState(0)
  const [views, setViews] = useState(0)

  useEffect(() => {
    initializeCanvas()
  }, [])

  const initializeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const size = Math.min(600, window.innerWidth - 40)
    canvas.width = size
    canvas.height = size

    // Draw placeholder
    drawPlaceholder(ctx, size)
  }

  const drawPlaceholder = (ctx: CanvasRenderingContext2D, size: number) => {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size)
    gradient.addColorStop(0, "#f8fafc")
    gradient.addColorStop(1, "#e2e8f0")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)

    // Decorative elements
    ctx.strokeStyle = "#cbd5e1"
    ctx.lineWidth = 2
    ctx.setLineDash([10, 10])
    ctx.strokeRect(20, 20, size - 40, size - 40)

    // Text
    ctx.fillStyle = "#64748b"
    ctx.font = "bold 24px system-ui"
    ctx.textAlign = "center"
    ctx.fillText("✨ Sua Arte Será Criada Aqui ✨", size / 2, size / 2 - 20)

    ctx.font = "16px system-ui"
    ctx.fillText('Digite um tema e clique em "Gerar Arte"', size / 2, size / 2 + 20)
  }

  const fetchUnsplashImage = async (query: string): Promise<string> => {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&client_id=${UNSPLASH_ACCESS_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Falha ao buscar imagens")
    }

    const data = await response.json()

    if (!data.results || data.results.length === 0) {
      throw new Error("Nenhuma imagem encontrada para este tema")
    }

    // Select random image from results
    const randomIndex = Math.floor(Math.random() * Math.min(5, data.results.length))
    return data.results[randomIndex].urls.regular
  }

  const applyArtisticEffect = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    effect: string,
    settings: ArtworkSettings,
  ) => {
    const { intensity, colorVariance, brushSize, complexity } = settings

    switch (effect) {
      case "impressionist":
        applyImpressionistEffect(ctx, canvas, intensity, colorVariance, brushSize)
        break
      case "watercolor":
        applyWatercolorEffect(ctx, canvas, intensity, colorVariance)
        break
      case "oil-painting":
        applyOilPaintingEffect(ctx, canvas, intensity, brushSize)
        break
      case "digital-glitch":
        applyGlitchEffect(ctx, canvas, intensity, complexity)
        break
      case "mosaic":
        applyMosaicEffect(ctx, canvas, brushSize, colorVariance)
        break
      case "sketch":
        applySketchEffect(ctx, canvas, intensity, complexity)
        break
      case "pop-art":
        applyPopArtEffect(ctx, canvas, colorVariance, intensity)
        break
      case "abstract":
        applyAbstractEffect(ctx, canvas, complexity, colorVariance)
        break
    }
  }

  const applyImpressionistEffect = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    intensity: number,
    colorVariance: number,
    brushSize: number,
  ) => {
    const strokeCount = 200 + intensity * 5
    const maxBrushSize = brushSize + intensity * 0.5

    ctx.globalCompositeOperation = "multiply"
    ctx.globalAlpha = 0.1 + intensity * 0.005

    for (let i = 0; i < strokeCount; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * maxBrushSize + 5

      // Get pixel color
      const imageData = ctx.getImageData(x, y, 1, 1)
      const [r, g, b] = imageData.data

      // Apply color variance
      const hueShift = (Math.random() - 0.5) * colorVariance * 2
      const [h, s, l] = rgbToHsl(r, g, b)
      const [nr, ng, nb] = hslToRgb((h + hueShift / 360) % 1, s, l)

      ctx.fillStyle = `rgb(${nr}, ${ng}, ${nb})`

      // Create brush stroke
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(Math.random() * Math.PI * 2)
      ctx.beginPath()
      ctx.ellipse(0, 0, size, size * 0.3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    ctx.globalCompositeOperation = "source-over"
    ctx.globalAlpha = 1
  }

  const applyWatercolorEffect = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    intensity: number,
    colorVariance: number,
  ) => {
    // Create watercolor bleeding effect
    const blobs = 50 + intensity

    ctx.globalCompositeOperation = "multiply"

    for (let i = 0; i < blobs; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const radius = 20 + Math.random() * (intensity * 2)

      // Get base color
      const imageData = ctx.getImageData(x, y, 1, 1)
      const [r, g, b] = imageData.data

      // Create gradient for bleeding effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)

      const alpha = 0.1 + intensity * 0.003
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`)
      gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`)
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.globalCompositeOperation = "source-over"
  }

  const applyOilPaintingEffect = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    intensity: number,
    brushSize: number,
  ) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const newData = new Uint8ClampedArray(data)

    const radius = Math.max(1, brushSize / 5)

    for (let y = radius; y < canvas.height - radius; y += 2) {
      for (let x = radius; x < canvas.width - radius; x += 2) {
        let totalR = 0,
          totalG = 0,
          totalB = 0,
          count = 0

        // Sample surrounding pixels
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const pixelIndex = ((y + dy) * canvas.width + (x + dx)) * 4
            totalR += data[pixelIndex]
            totalG += data[pixelIndex + 1]
            totalB += data[pixelIndex + 2]
            count++
          }
        }

        // Apply averaged color to area
        const avgR = totalR / count
        const avgG = totalG / count
        const avgB = totalB / count

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const pixelIndex = ((y + dy) * canvas.width + (x + dx)) * 4
            if (pixelIndex >= 0 && pixelIndex < newData.length) {
              newData[pixelIndex] = avgR
              newData[pixelIndex + 1] = avgG
              newData[pixelIndex + 2] = avgB
            }
          }
        }
      }
    }

    const newImageData = new ImageData(newData, canvas.width, canvas.height)
    ctx.putImageData(newImageData, 0, 0)
  }

  const applyGlitchEffect = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    intensity: number,
    complexity: number,
  ) => {
    const glitchLines = Math.floor(complexity / 10)

    for (let i = 0; i < glitchLines; i++) {
      const y = Math.random() * canvas.height
      const height = 1 + Math.random() * (intensity / 10)
      const offset = (Math.random() - 0.5) * (intensity / 2)

      const imageData = ctx.getImageData(0, y, canvas.width, height)
      ctx.putImageData(imageData, offset, y)
    }

    // Add color channel shifting
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < intensity / 1000) {
        const shift = Math.floor((Math.random() - 0.5) * intensity)
        data[i] = Math.min(255, Math.max(0, data[i] + shift)) // R
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] - shift)) // B
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const applyMosaicEffect = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    tileSize: number,
    colorVariance: number,
  ) => {
    const size = Math.max(5, tileSize / 3)

    for (let y = 0; y < canvas.height; y += size) {
      for (let x = 0; x < canvas.width; x += size) {
        // Get average color of tile area
        const imageData = ctx.getImageData(x, y, Math.min(size, canvas.width - x), Math.min(size, canvas.height - y))
        const data = imageData.data

        let r = 0,
          g = 0,
          b = 0,
          count = 0
        for (let i = 0; i < data.length; i += 4) {
          r += data[i]
          g += data[i + 1]
          b += data[i + 2]
          count++
        }

        if (count > 0) {
          r = Math.floor(r / count)
          g = Math.floor(g / count)
          b = Math.floor(b / count)

          // Apply color variance
          const variance = colorVariance / 100
          r = Math.min(255, Math.max(0, r + (Math.random() - 0.5) * 255 * variance))
          g = Math.min(255, Math.max(0, g + (Math.random() - 0.5) * 255 * variance))
          b = Math.min(255, Math.max(0, b + (Math.random() - 0.5) * 255 * variance))

          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
          ctx.fillRect(x, y, size, size)

          // Add tile border
          ctx.strokeStyle = `rgba(0, 0, 0, 0.1)`
          ctx.lineWidth = 0.5
          ctx.strokeRect(x, y, size, size)
        }
      }
    }
  }

  const applySketchEffect = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    intensity: number,
    complexity: number,
  ) => {
    // Convert to grayscale first
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
      data[i] = gray
      data[i + 1] = gray
      data[i + 2] = gray
    }

    ctx.putImageData(imageData, 0, 0)

    // Add sketch lines
    ctx.globalCompositeOperation = "multiply"
    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)"
    ctx.lineWidth = 1

    const lineCount = complexity * 2

    for (let i = 0; i < lineCount; i++) {
      const x1 = Math.random() * canvas.width
      const y1 = Math.random() * canvas.height
      const length = 10 + Math.random() * (intensity / 2)
      const angle = Math.random() * Math.PI * 2

      const x2 = x1 + Math.cos(angle) * length
      const y2 = y1 + Math.sin(angle) * length

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    ctx.globalCompositeOperation = "source-over"
  }

  const applyPopArtEffect = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    colorVariance: number,
    intensity: number,
  ) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Posterize colors
    const levels = Math.max(2, 8 - Math.floor(intensity / 20))
    const factor = 255 / (levels - 1)

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(data[i] / factor) * factor // R
      data[i + 1] = Math.round(data[i + 1] / factor) * factor // G
      data[i + 2] = Math.round(data[i + 2] / factor) * factor // B

      // Boost saturation
      const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2])
      const newS = Math.min(1, s * (1 + colorVariance / 100))
      const [r, g, b] = hslToRgb(h, newS, l)

      data[i] = r
      data[i + 1] = g
      data[i + 2] = b
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const applyAbstractEffect = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    complexity: number,
    colorVariance: number,
  ) => {
    ctx.globalCompositeOperation = "overlay"

    const shapeCount = complexity

    for (let i = 0; i < shapeCount; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 100 + 20

      // Get base color and modify
      const imageData = ctx.getImageData(x, y, 1, 1)
      const [r, g, b] = imageData.data
      const [h, s, l] = rgbToHsl(r, g, b)

      const newH = (h + ((Math.random() - 0.5) * colorVariance) / 100) % 1
      const [nr, ng, nb] = hslToRgb(newH, Math.min(1, s * 1.5), l)

      ctx.fillStyle = `rgba(${nr}, ${ng}, ${nb}, 0.3)`

      // Random shapes
      const shapeType = Math.floor(Math.random() * 3)
      ctx.beginPath()

      switch (shapeType) {
        case 0: // Circle
          ctx.arc(x, y, size / 2, 0, Math.PI * 2)
          break
        case 1: // Rectangle
          ctx.rect(x - size / 2, y - size / 2, size, size)
          break
        case 2: // Triangle
          ctx.moveTo(x, y - size / 2)
          ctx.lineTo(x + size / 2, y + size / 2)
          ctx.lineTo(x - size / 2, y + size / 2)
          break
      }

      ctx.fill()
    }

    ctx.globalCompositeOperation = "source-over"
  }

  // Color conversion utilities
  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0,
      l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return [h, s, l]
  }

  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }

  const generateArt = async () => {
    if (!searchQuery.trim() || isGenerating) return

    setIsGenerating(true)

    try {
      const imageUrl = await fetchUnsplashImage(searchQuery)
      setCurrentImage(imageUrl)

      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")

      if (!canvas || !ctx) return

      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        // Calculate dimensions maintaining aspect ratio
        const ratio = Math.min(canvas.width / img.width, canvas.height / img.height)
        const newWidth = img.width * ratio
        const newHeight = img.height * ratio

        // Clear and draw base image
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, (canvas.width - newWidth) / 2, (canvas.height - newHeight) / 2, newWidth, newHeight)

        // Apply artistic effect
        applyArtisticEffect(ctx, canvas, settings.effect, settings)

        // Update stats
        setViews((prev) => prev + 1)

        // Add to history
        const dataUrl = canvas.toDataURL()
        setArtworkHistory((prev) => [dataUrl, ...prev.slice(0, 9)])

        toast({
          title: "Arte criada com sucesso!",
          description: `Efeito ${ARTISTIC_EFFECTS.find((e) => e.id === settings.effect)?.name} aplicado.`,
        })
      }

      img.src = imageUrl
    } catch (error) {
      console.error("Erro ao gerar arte:", error)
      toast({
        title: "Erro ao gerar arte",
        description: "Tente outro tema ou verifique sua conexão.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateRandomTheme = () => {
    const randomTheme = RANDOM_THEMES[Math.floor(Math.random() * RANDOM_THEMES.length)]
    setSearchQuery(randomTheme)
    setTimeout(generateArt, 100)
  }

  const saveArtwork = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = searchQuery
      ? `arte-${searchQuery.toLowerCase().replace(/\s+/g, "-")}-${timestamp}`
      : `arte-generativa-${timestamp}`

    link.download = `${filename}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()

    toast({
      title: "Artwork salvo!",
      description: "Sua obra de arte foi baixada com sucesso.",
    })
  }

  const shareArtwork = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Arte Generativa: ${searchQuery}`,
          text: "Confira esta obra de arte generativa que criei!",
          url: window.location.href,
        })
      } catch (error) {
        console.log("Erro ao compartilhar:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para sua área de transferência.",
      })
    }
  }

  const likeArtwork = () => {
    setLikes((prev) => prev + 1)
    toast({
      title: "❤️ Obrigado!",
      description: "Você curtiu esta obra de arte!",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Gerador de Arte Generativa
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transforme suas ideias em obras de arte únicas usando inteligência artificial e efeitos algorítmicos
            avançados
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Canvas Area */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Sua Obra de Arte
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Search Input */}
                <div className="flex gap-2 mb-6">
                  <Input
                    placeholder="Digite um tema (ex: floresta mística, cidade cyberpunk...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && generateArt()}
                    className="flex-1"
                  />
                  <Button
                    onClick={generateArt}
                    disabled={isGenerating || !searchQuery.trim()}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Criando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Gerar Arte
                      </>
                    )}
                  </Button>
                </div>

                {/* Canvas */}
                <div className="relative bg-gray-50 rounded-lg p-4 mb-6">
                  <canvas
                    ref={canvasRef}
                    className="w-full max-w-full h-auto border-2 border-gray-200 rounded-lg shadow-inner bg-white"
                  />
                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Processando sua obra de arte...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button onClick={saveArtwork} variant="outline" disabled={!currentImage}>
                    <Download className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button onClick={generateRandomTheme} variant="outline">
                    <Shuffle className="w-4 h-4 mr-2" />
                    Tema Aleatório
                  </Button>
                  <Button onClick={shareArtwork} variant="outline" disabled={!currentImage}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartilhar
                  </Button>
                  <Button onClick={likeArtwork} variant="outline" disabled={!currentImage}>
                    <Heart className="w-4 h-4 mr-2" />
                    Curtir ({likes})
                  </Button>
                </div>

                {/* Stats */}
                {currentImage && (
                  <div className="flex justify-center gap-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {views} visualizações
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {likes} curtidas
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Effect Selection */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Efeitos Artísticos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {ARTISTIC_EFFECTS.map((effect) => (
                    <Button
                      key={effect.id}
                      variant={settings.effect === effect.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings((prev) => ({ ...prev, effect: effect.id }))}
                      className="justify-start text-xs"
                    >
                      <span className="mr-1">{effect.icon}</span>
                      {effect.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurações Avançadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Intensidade: {settings.intensity}%</label>
                  <Slider
                    value={[settings.intensity]}
                    onValueChange={([value]) => setSettings((prev) => ({ ...prev, intensity: value }))}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Variação de Cor: {settings.colorVariance}%</label>
                  <Slider
                    value={[settings.colorVariance]}
                    onValueChange={([value]) => setSettings((prev) => ({ ...prev, colorVariance: value }))}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tamanho do Pincel: {settings.brushSize}px</label>
                  <Slider
                    value={[settings.brushSize]}
                    onValueChange={([value]) => setSettings((prev) => ({ ...prev, brushSize: value }))}
                    min={5}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Complexidade: {settings.complexity}%</label>
                  <Slider
                    value={[settings.complexity]}
                    onValueChange={([value]) => setSettings((prev) => ({ ...prev, complexity: value }))}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* History */}
            {artworkHistory.length > 0 && (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Histórico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {artworkHistory.slice(0, 6).map((artwork, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={artwork || "/placeholder.svg"}
                          alt={`Artwork ${index + 1}`}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => {
                            const canvas = canvasRef.current
                            const ctx = canvas?.getContext("2d")
                            if (canvas && ctx) {
                              const img = new Image()
                              img.onload = () => {
                                ctx.clearRect(0, 0, canvas.width, canvas.height)
                                ctx.drawImage(img, 0, 0)
                              }
                              img.src = artwork
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Themes */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Temas Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {["Floresta Mística", "Cidade Cyberpunk", "Oceano Profundo", "Espaço Sideral", "Arte Abstrata"].map(
                    (theme) => (
                      <Badge
                        key={theme}
                        variant="secondary"
                        className="cursor-pointer hover:bg-purple-100"
                        onClick={() => {
                          setSearchQuery(theme.toLowerCase())
                          setTimeout(generateArt, 100)
                        }}
                      >
                        {theme}
                      </Badge>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>
            Imagens fornecidas pelo{" "}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Unsplash
            </a>{" "}
            • Efeitos algorítmicos personalizados • Criado com ❤️
          </p>
        </div>
      </div>
    </div>
  )
}
